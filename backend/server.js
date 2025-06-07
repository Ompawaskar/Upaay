import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteer.routes.js';
import testRoutes from './routes/test.routes.js';
import studentRoutes from './routes/student.routes.js';
import ocrRoutes from './routes/ocr.routes.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


const PORT = 3000;
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/ocr', ocrRoutes);

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, default: 'anonymous' },
  startLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalTimeInLocation: { type: Number, default: 0 }, // in seconds
  isCurrentlyInLocation: { type: Boolean, default: true },
  lastLocationUpdate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Store active sessions in memory for quick access
const activeSessions = new Map();

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Start session
  socket.on('startSession', async (data) => {
    try {
      const sessionId = uuidv4();
      const { location, targetLocation } = data;

      const diff = calculateDistance(
        location.latitude, location.longitude,
        targetLocation.latitude, targetLocation.longitude);
      
        console.log(diff);
        

      if(diff > 100)
        return socket.emit('error', { message: 'You are too far from the target location to start a session.' }); 

      // Create new session in database
      const newSession = new Session({
        sessionId,
        startLocation: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        startTime: new Date(),
        lastLocationUpdate: new Date()
      });

      await newSession.save();

      // Store session in memory for quick access
      activeSessions.set(sessionId, {
        sessionId,
        socketId: socket.id,
        startLocation: location,
        startTime: Date.now(),
        totalTimeInLocation: 0,
        isCurrentlyInLocation: true,
        lastTimeUpdate: Date.now()
      });

      socket.emit('sessionStarted', { sessionId });
      console.log(`Session started: ${sessionId}`);

    } catch (error) {
      console.error('Error starting session:', error);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });

  // Handle location updates
  socket.on('locationUpdate', async (data) => {
    try {
      const { sessionId, location } = data;
      const session = activeSessions.get(sessionId);
      console.log(data);
      
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const distance = calculateDistance(
        session.startLocation.latitude,
        session.startLocation.longitude,
        location.latitude,
        location.longitude
      );

      const isInLocation = distance <= 100; // 100 meters
      const currentTime = Date.now();

      // If user was in location and still is, add time
      if (session.isCurrentlyInLocation && isInLocation) {
        const timeToAdd = Math.floor((currentTime - session.lastTimeUpdate) / 1000);
        session.totalTimeInLocation += timeToAdd;
      }

      // Update session state
      session.isCurrentlyInLocation = isInLocation;
      session.lastTimeUpdate = currentTime;

      // Update database
      await Session.findOneAndUpdate(
        { sessionId },
        {
          totalTimeInLocation: session.totalTimeInLocation,
          isCurrentlyInLocation: isInLocation,
          lastLocationUpdate: new Date()
        }
      );

      // Emit status to client
      socket.emit('locationStatus', {
        inLocation: isInLocation,
        distance: Math.round(distance),
        totalTime: session.totalTimeInLocation
      });

      console.log(`Session ${sessionId}: Distance ${Math.round(distance)}m, In location: ${isInLocation}`);

    } catch (error) {
      console.error('Error updating location:', error);
      socket.emit('error', { message: 'Failed to update location' });
    }
  });

  // Stop session
  socket.on('stopSession', async (data) => {
    try {
      const { sessionId } = data;
      const session = activeSessions.get(sessionId);

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const currentTime = Date.now();

      // Add final time if user is still in location
      if (session.isCurrentlyInLocation) {
        const timeToAdd = Math.floor((currentTime - session.lastTimeUpdate) / 1000);
        session.totalTimeInLocation += timeToAdd;
      }

      // Update database with final values
      await Session.findOneAndUpdate(
        { sessionId },
        {
          endTime: new Date(),
          totalTimeInLocation: session.totalTimeInLocation,
          isActive: false
        }
      );

      // Remove from active sessions
      activeSessions.delete(sessionId);

      // Send final result to client
      socket.emit('sessionEnded', {
        sessionId,
        totalTime: session.totalTimeInLocation
      });

      console.log(`Session ended: ${sessionId}, Total time: ${session.totalTimeInLocation}s`);

    } catch (error) {
      console.error('Error stopping session:', error);
      socket.emit('error', { message: 'Failed to stop session' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up any active sessions for this socket
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.socketId === socket.id) {
        // Mark session as inactive in database
        Session.findOneAndUpdate(
          { sessionId },
          { isActive: false, endTime: new Date() }
        ).catch(err => console.error('Error cleaning up session:', err));
        
        activeSessions.delete(sessionId);
        console.log(`Cleaned up session ${sessionId} for disconnected user`);
      }
    }
  });
});


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
).catch(err => {
  console.error('MongoDB connection error:', err);
});

server.listen(5000, () => {
  console.log('Socket.IO server is running on port 5000');
});

