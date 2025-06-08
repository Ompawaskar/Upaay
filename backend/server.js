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

import classScheduleRoutes from './routes/classSchedule.routes.js';

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/students', studentRoutes);

app.use('/api/class-schedule', classScheduleRoutes);

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

const availabilitySchema = new mongoose.Schema({
  volunteerId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      '9:00 AM - 11:00 AM',
      '11:00 AM - 1:00 PM',
      '2:00 PM - 4:00 PM',
      '4:00 PM - 6:00 PM',
      '6:00 PM - 8:00 PM'
    ]
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

availabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

app.get('/volunteers/available', async (req, res) => {
  try {
    const { date, timeSlot } = req.query;
    // Validate required parameters
    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Date and timeSlot are required parameters'
      });
    }

    // Parse the date to ensure it's in the correct format
    const targetDate = new Date(date);
    
    // Validate date
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Find available volunteers for the specific date and time slot
    const availableVolunteers = await Availability.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            $lt: new Date(targetDate.setHours(23, 59, 59, 999))
          },
          timeSlot: timeSlot,
          isAvailable: true
        }
      },
      {
        $lookup: {
          from: 'volunteers', // Collection name (usually pluralized)
          localField: 'volunteerId',
          foreignField: 'volunteerId',
          as: 'volunteerDetails'
        }
      },
      {
        $unwind: '$volunteerDetails'
      },
      {
        $project: {
          _id: 1,
          volunteerId: 1,
          date: 1,
          timeSlot: 1,
          name: '$volunteerDetails.name',
          email: '$volunteerDetails.email',
          subjects: '$volunteerDetails.subjects'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: availableVolunteers,
      count: availableVolunteers.length
    });

  } catch (error) {
    console.error('Error fetching available volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

const attendanceSchema = new mongoose.Schema({
  date: Date,
  studentsNames : [{
    type: String,
    required: true
  }]
});

export default mongoose.model('attendanceModel', attendanceSchema)

app.post('/add-attendance', async (req, res) => {
  console.log(req.body)
  const { date, studentsNames } = req.body;
  try {
    

    // Validate input
    if (!studentsNames) {
      return res.status(400).json({ message: 'Students not found' });
    }
      
    const adddedDetails = await Attendance.create({
      date: date,
      studentsNames: studentsNames,
    });

    return res.status(200).json({ message: 'Attendance added successfully' });

   
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  // return res.status(200).json({ message: 'Attendance added successfully' });
})

const Availability = mongoose.model('Availability', availabilitySchema);
app.post('/api/availability', async (req, res) => {
  try {
    const { volunteerId, date, timeSlot, isAvailable } = req.body;

    // Validate required fields
    if (!volunteerId || !date || !timeSlot || typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: volunteerId, date, timeSlot, isAvailable'
      });
    }

    // Validate date format
    const availabilityDate = new Date(date);
    if (isNaN(availabilityDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (availabilityDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot set availability for past dates'
      });
    }

    // Use upsert to create or update availability
    const result = await Availability.findOneAndUpdate(
      { volunteerId, date: availabilityDate, timeSlot },
      { 
        volunteerId, 
        date: availabilityDate, 
        timeSlot, 
        isAvailable,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );

    console.log("Result:",result);
    

    res.status(200).json({
      success: true,
      message: `Availability ${isAvailable ? 'marked' : 'removed'} successfully`,
      data: result
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Availability already exists for this slot'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/availability', async (req, res) => {
  try {
    const { volunteerId, startDate, endDate } = req.query;
    console.log('Query params:', req.query);

    if (!volunteerId) {
      return res.status(400).json({
        success: false,
        message: 'volunteerId is required'
      });
    }

    const query = { volunteerId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const availabilities = await Availability.find(query).sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      availabilities
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

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
      const { targetLocation } = data;
      
      const location = {
        latitude: 19.15402036297085,
        longitude: 72.85437204232859
      }

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
      const { sessionId} = data;
      const location = {
        latitude: 19.15402036297085,
        longitude: 72.85437204232859
      }
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
  console.log('Socket.IO server is running on port 3000');
});

