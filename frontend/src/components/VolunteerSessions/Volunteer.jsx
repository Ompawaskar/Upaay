import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, BookOpen, Calculator, Languages, Play, Square, CheckCircle, X, AlertTriangle } from 'lucide-react';

const Volunteer = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [status, setStatus] = useState('Ready to start session');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [attendedSessions, setAttendedSessions] = useState([]);
  const [error, setError] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const targetLocationMarkerRef = useRef(null);

  // Google Maps API Key from environment
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP;


  // Dummy data for upcoming sessions with target locations
  const upcomingSessions = [
    {
      id: 1,
      subject: 'Math',
      topic: 'Algebra Fundamentals',
      scheduledTime: '2025-06-08T10:00:00',
      duration: '60 minutes',
      instructor: 'Dr. Smith',
      icon: Calculator,
      color: 'bg-blue-500',
      targetLocation: {
        latitude: 19.15402036297085,
        longitude: 72.85437204232859,
        address: 'JPMC'
        
      }
    },
    {
      id: 2,
      subject: 'English',
      topic: 'Creative Writing',
      scheduledTime: '2025-06-08T14:30:00',
      duration: '45 minutes',
      instructor: 'Prof. Johnson',
      icon: BookOpen,
      color: 'bg-green-500',
      targetLocation: {
        latitude: 19.153916270650555,
        longitude: 72.85501127896872,
        address: 'Sanu Mobile, Mumbai'
      }
    },
    {
      id: 3,
      subject: 'Hindi',
      topic: 'Poetry Analysis',
      scheduledTime: '2025-06-09T11:00:00',
      duration: '50 minutes',
      instructor: 'Mrs. Sharma',
      icon: Languages,
      color: 'bg-purple-500',
      targetLocation: {
        latitude: 19.0330,
        longitude: 72.8570,
        address: 'Worli Education Center'
      }
    },
    {
      id: 4,
      subject: 'Math',
      topic: 'Geometry Basics',
      scheduledTime: '2025-06-09T16:00:00',
      duration: '60 minutes',
      instructor: 'Dr. Smith',
      icon: Calculator,
      color: 'bg-blue-500',
      targetLocation: {
        latitude: 19.0896,
        longitude: 72.8656,
        address: 'Andheri Study Center'
      }
    }
  ];

  // Load Google Maps API
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not found in environment variables');
      return;
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load Google Maps API');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('sessionStarted', (data) => {
      console.log('Session started:', data);
      sessionIdRef.current = data.sessionId;
      setStatus('Session active - Tracking location');
    });

    socketRef.current.on('locationStatus', (data) => {
      setStatus(data.inLocation ? 'In location - Time counting' : 'Outside location - Time paused');
    });

    socketRef.current.on('sessionEnded', (data) => {
      console.log("Session ended");
      
      const completedSession = {
        id: Date.now(),
        subject: currentSession?.subject || 'Unknown',
        topic: currentSession?.topic || 'Session',
        timeSpent: data.totalTime,
        completedAt: new Date(),
        status: 'completed'
      };
      
      setAttendedSessions(prev => [completedSession, ...prev]);
      setIsSessionActive(false);
      setCurrentSession(null);
      setStatus(`Session completed. Time spent: ${formatTime(data.totalTime)}`);
      
      stopLocationTracking();
      sessionIdRef.current = null;
    });

    socketRef.current.on('error', (error) => {
      setError(error.message);
      setStatus('Error occurred');
      setIsSessionActive(false);
      setCurrentSession(null);
      stopLocationTracking();
      sessionIdRef.current = null;
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopLocationTracking();
    };
  }, [currentSession]);

  useEffect(() => {
    let interval;
    if (isSessionActive && startTimeRef.current) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSessionTime(formatTime(elapsed));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTimeSpent = () => {
    return attendedSessions.reduce((total, session) => total + session.timeSpent, 0);
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!isGoogleMapsLoaded || !window.google) {
        reject(new Error('Google Maps not loaded'));
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: 19.15402036297085,
              longitude: 72.85437204232859,
              accuracy: position.coords.accuracy
            };
            resolve(location);
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser'));
      }
    });
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!window.google || !window.google.maps) {
      return null;
    }

    const point1 = new window.google.maps.LatLng(lat1, lng1);
    const point2 = new window.google.maps.LatLng(lat2, lng2);
    
    return window.google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
  };

  const startLocationTracking = (sessionData) => {
    if (!isGoogleMapsLoaded || !window.google) {
      setError('Google Maps not loaded');
      return;
    }

    const trackLocation = () => {
      getCurrentLocation()
        .then((currentLocation) => {
          if (sessionIdRef.current) {
            // Calculate distance using Google Maps geometry library
            const newLoc = {
              latitude: 19.15402036297085,
              longitude: 72.85437204232859,
            }
            const distance = calculateDistance(
              19.15402036297085,
              72.85437204232859,
              sessionData.targetLocation.latitude,
              sessionData.targetLocation.longitude
            );

            const locationData = {
              ...newLoc,
              distanceToTarget: distance
            };
            
            console.log('Sending location update with distance:', distance);
            socketRef.current.emit('locationUpdate', { 
              sessionId: sessionIdRef.current,
              location: locationData 
            });

            // Update map markers if map is initialized
            updateMapMarkers(newLoc, sessionData.targetLocation);
          }
        })
        .catch((error) => {
          console.error('Location tracking error:', error);
          setStatus(`Location error: ${error.message}`);
        });
    };

    // Initial location update
    trackLocation();

    // Set up periodic location updates
    watchIdRef.current = setInterval(trackLocation, 5000); // Update every 5 seconds
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      clearInterval(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const initializeMap = (currentLocation, targetLocation) => {
    if (!isGoogleMapsLoaded || !window.google) {
      return;
    }

    const mapElement = document.getElementById('session-map');
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      zoom: 15,
      center: { lat: currentLocation.latitude, lng: currentLocation.longitude },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    });

    mapRef.current = map;

    // Add current location marker (blue)
    currentLocationMarkerRef.current = new window.google.maps.Marker({  
      position: { lat: 19.15402036297085, lng: 72.85437204232859 },
      map: map,
      title: 'Your Current Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
          </svg>
        `)
      }
    });

    // Add target location marker (red)
    targetLocationMarkerRef.current = new window.google.maps.Marker({
      position: { lat: targetLocation.latitude, lng: targetLocation.longitude },
      map: map,
      title: targetLocation.address,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#EF4444" stroke="white" stroke-width="2"/>
          </svg>
        `)
      }
    });

    // Fit map to show both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    bounds.extend({ lat: targetLocation.latitude, lng: targetLocation.longitude });
    map.fitBounds(bounds);
  };

  const updateMapMarkers = (currentLocation, targetLocation) => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setPosition({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      });
    }

    if (mapRef.current) {
      // Optionally recenter map on current location
      mapRef.current.setCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      });
    }
  };

  const startSession = async (sessionData) => {
    if (!isGoogleMapsLoaded) {
      setError('Google Maps is not loaded yet. Please wait and try again.');
      return;
    }

    setCurrentSession(sessionData);
    setStatus('Getting your location...');
    
    try {
      const location = await getCurrentLocation();
      console.log("Location acquired:", location);
      
      // Start session with target location
      socketRef.current.emit('startSession', { 
        location,
        targetLocation: sessionData.targetLocation 
      });
      
      setIsSessionActive(true);
      startTimeRef.current = Date.now();
      setSessionTime('00:00:00');
      
      // Initialize map
      setTimeout(() => {
        initializeMap(location, sessionData.targetLocation);
      }, 100);
      
      // Wait for sessionStarted event before starting location tracking
      const handleSessionStarted = (data) => {
        console.log('Session started, now starting location tracking');
        startLocationTracking(sessionData);
        socketRef.current.off('sessionStarted', handleSessionStarted);
      };
      
      socketRef.current.on('sessionStarted', handleSessionStarted);
      
    } catch (error) {
      setError(`Error getting location: ${error.message}`);
      setStatus('Location access denied');
    }
  };

  const stopSession = () => {
    if (sessionIdRef.current) {
      socketRef.current.emit('stopSession', { sessionId: sessionIdRef.current });
      stopLocationTracking();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getSubjectIcon = (subject) => {
    switch (subject.toLowerCase()) {
      case 'math': return Calculator;
      case 'english': return BookOpen;
      case 'hindi': return Languages;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject.toLowerCase()) {
      case 'math': return 'bg-blue-500';
      case 'english': return 'bg-green-500';
      case 'hindi': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Session Tracker</h1>
          <p className="text-gray-600">Track your learning sessions with Google Maps location tracking</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="h-auto p-1 text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Google Maps Loading Status */}
        {!isGoogleMapsLoaded && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Loading Google Maps API...
            </AlertDescription>
          </Alert>
        )}

        {/* Active Session Card */}
        {isSessionActive && currentSession && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${getSubjectColor(currentSession.subject)} text-white`}>
                    {React.createElement(getSubjectIcon(currentSession.subject), { size: 24 })}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentSession.subject} - {currentSession.topic}</CardTitle>
                    <CardDescription>Session in progress</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-blue-600">{sessionTime}</div>
                  <div className="text-sm text-gray-500">Session Time</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{status}</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={stopSession}
                    variant="destructive"
                    className="w-full md:w-auto"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    End Session
                  </Button>
                </div>
              </div>
              
              {/* Google Maps */}
              <div className="mt-4">
                <div 
                  id="session-map" 
                  className="w-full h-64 rounded-lg border border-gray-200"
                  style={{ minHeight: '250px' }}
                ></div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Blue marker: Your location | Red marker: Target location
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Upcoming Sessions</h2>
            </div>
            
            <div className="space-y-4">
              {upcomingSessions.map((session) => {
                const IconComponent = session.icon;
                return (
                  <Card key={session.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${session.color} text-white`}>
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{session.subject}</CardTitle>
                            <CardDescription>{session.topic}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{session.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {formatDate(session.scheduledTime)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Instructor: {session.instructor}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        <span>{session.targetLocation.address}</span>
                      </div>
                      <Button 
                        onClick={() => startSession(session)}
                        disabled={isSessionActive || !isGoogleMapsLoaded}
                        className="w-full"
                        variant={isSessionActive ? "secondary" : "default"}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {isSessionActive ? 'Session Active' : !isGoogleMapsLoaded ? 'Loading Maps...' : 'Start Session'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Attended Sessions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Completed Sessions</h2>
              </div>
              {attendedSessions.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Total: {formatTime(getTotalTimeSpent())}
                </Badge>
              )}
            </div>

            {attendedSessions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed sessions yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start a session to see your progress here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {attendedSessions.map((session) => {
                  const IconComponent = getSubjectIcon(session.subject);
                  const colorClass = getSubjectColor(session.subject);
                  
                  return (
                    <Card key={session.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                              <IconComponent size={20} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{session.subject}</CardTitle>
                              <CardDescription>{session.topic}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <Clock className="inline h-4 w-4 mr-1" />
                            {session.completedAt.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {formatTime(session.timeSpent)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;