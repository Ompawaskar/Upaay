import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const VolunteerScheduler = () => {
  const { user } = useUser();
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  // Dummy existing appointments data
  const existingAppointments = [
    {
      id: 1,
      date: '2025-06-10',
      time: '10:00 AM - 12:00 PM',
      location: 'Bandra West, Mumbai',
      students: 8,
      subject: 'Mathematics',
      type: 'scheduled'
    },
    {
      id: 2,
      date: '2025-06-12',
      time: '3:00 PM - 5:00 PM',
      location: 'Andheri East, Mumbai',
      students: 12,
      subject: 'English',
      type: 'scheduled'
    },
    {
      id: 3,
      date: '2025-06-15',
      time: '9:00 AM - 11:00 AM',
      location: 'Dadar Central, Mumbai',
      students: 6,
      subject: 'Science',
      type: 'scheduled'
    },
    {
      id: 4,
      date: '2025-06-18',
      time: '2:00 PM - 4:00 PM',
      location: 'Powai, Mumbai',
      students: 10,
      subject: 'Mathematics',
      type: 'scheduled'
    },
    {
      id: 5,
      date: '2025-06-22',
      time: '11:00 AM - 1:00 PM',
      location: 'Colaba, Mumbai',
      students: 15,
      subject: 'English',
      type: 'scheduled'
    }
  ];

  // Dummy upcoming appointments for sidebar

  const upcomingAppointments = existingAppointments.slice(0, 3);

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM'
  ];

  // Load existing availability from backend when component mounts
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      loadExistingAvailability();
    }
  }, [user, currentMonth]);

  const loadExistingAvailability = async () => {
    try {
      const volunteerId = user.emailAddresses[0].emailAddress;
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const response = await fetch(`http://localhost:3000/api/availability?volunteerId=${volunteerId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      
      if (response.ok) {
        const data = await response.json();
        const availabilitySlots = new Set();
        
        data.availabilities?.forEach(slot => {
          if (slot.isAvailable) {
            const dateStr = new Date(slot.date).toISOString().split('T')[0];
            availabilitySlots.add(`${dateStr}_${slot.timeSlot}`);
          }
        });
        
        setSelectedSlots(availabilitySlots);
      }
      console.log("Yeh Respones",response);
      
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDateAppointments = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return existingAppointments.filter(apt => apt.date === dateStr);
  };

  const hasAvailability = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(selectedSlots).some(slot => slot.startsWith(dateStr));
  };

  const handleDateClick = (date) => {
    if (!date || date < new Date().setHours(0, 0, 0, 0)) return;
    setSelectedDate(date);
    setShowTimeSlotModal(true);
  };

  const handleTimeSlotSelect = async (timeSlot) => {
    if (!selectedDate || !user?.emailAddresses?.[0]?.emailAddress) {
      alert('User not authenticated');
      return;
    }
    
    setLoading(true);
    
    try {
      const slotKey = `${selectedDate.toISOString().split('T')[0]}_${timeSlot}`;
      const isCurrentlySelected = selectedSlots.has(slotKey);
      const volunteerId = user.emailAddresses[0].emailAddress;
      // Make API call to backend
      const response = await fetch('http://localhost:3000/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteerId: volunteerId,
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: timeSlot,
          isAvailable: !isCurrentlySelected
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update local state only after successful API call
        const newSelectedSlots = new Set(selectedSlots);
        
        if (isCurrentlySelected) {
          newSelectedSlots.delete(slotKey);
        } else {
          newSelectedSlots.add(slotKey);
        }
        
        setSelectedSlots(newSelectedSlots);
        
        // Show success message
        const action = isCurrentlySelected ? 'removed' : 'added';
        alert(`Availability ${action} successfully!`);
      } else {
        // Show error message
        alert(result.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isTimeSlotSelected = (date, timeSlot) => {
    if (!date) return false;
    const slotKey = `${date.toISOString().split('T')[0]}_${timeSlot}`;
    return selectedSlots.has(slotKey);
  };

  const handleMouseEnter = (date, event) => {
    if (!date || getDateAppointments(date).length === 0) return;
    setHoveredDate(date);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const hoveredAppointments = hoveredDate ? getDateAppointments(hoveredDate) : [];
  const userName = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your teaching schedule and availability</p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    const appointments = getDateAppointments(date);
                    const hasAppointments = appointments.length > 0;
                    const hasAvailabilitySlots = hasAvailability(date);
                    const isPast = isPastDate(date);
                    const todayDate = isToday(date);

                    return (
                      <div key={index} className="h-24">
                        {date && (
                          <div
                            className={`
                              h-full border-2 rounded-xl p-2 cursor-pointer transition-all duration-200
                              ${isPast 
                                ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                                : hasAppointments
                                  ? 'bg-red-50 border-red-200 hover:border-red-300 hover:shadow-md'
                                  : hasAvailabilitySlots
                                    ? 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-md'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                              }
                              ${todayDate ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                            `}
                            onClick={() => handleDateClick(date)}
                            onMouseEnter={(e) => handleMouseEnter(date, e)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className={`
                              font-semibold text-sm mb-1
                              ${isPast ? 'text-gray-400' : todayDate ? 'text-blue-600' : 'text-gray-700'}
                            `}>
                              {date.getDate()}
                            </div>
                            
                            <div className="space-y-1">
                              {hasAppointments && (
                                <div className="w-full h-1.5 bg-red-400 rounded-full"></div>
                              )}
                              {hasAvailabilitySlots && (
                                <div className="w-full h-1.5 bg-green-400 rounded-full"></div>
                              )}
                            </div>
                            
                            {todayDate && (
                              <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-red-400 rounded mr-2"></div>
                    <span className="text-gray-600">Scheduled Sessions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-green-400 rounded mr-2"></div>
                    <span className="text-gray-600">Available Slots</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-blue-400 rounded mr-2"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Upcoming Sessions
              </h3>
              
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {formatDate(appointment.date)}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {appointment.subject}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {appointment.location}
                      </div>
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {appointment.students} students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions Scheduled</span>
                  <span className="font-bold text-2xl text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Students Taught</span>
                  <span className="font-bold text-2xl text-green-600">84</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours Volunteered</span>
                  <span className="font-bold text-2xl text-purple-600">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slot Selection Modal */}
      {showTimeSlotModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Set Availability
                </h3>
                <button
                  onClick={() => setShowTimeSlotModal(false)}
                  className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <p className="text-blue-100 mt-2">
                {selectedDate.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Select your available time slots:</p>
              <div className="space-y-3">
                {timeSlots.map(timeSlot => {
                  const isSelected = isTimeSlotSelected(selectedDate, timeSlot);
                  return (
                    <button
                      key={timeSlot}
                      onClick={() => handleTimeSlotSelect(timeSlot)}
                      disabled={loading}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative
                        ${loading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{timeSlot}</span>
                        {loading && (
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        )}
                        {!loading && isSelected && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {loading && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  Updating availability...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredDate && hoveredAppointments.length > 0 && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-4 rounded-xl shadow-2xl max-w-sm pointer-events-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-sm font-semibold mb-2">
            {hoveredDate.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          {hoveredAppointments.map(apt => (
            <div key={apt.id} className="text-xs space-y-1 mb-2 last:mb-0">
              <div className="font-medium text-blue-300">{apt.subject}</div>
              <div className="text-gray-300">{apt.time}</div>
              <div className="text-gray-300 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {apt.location}
              </div>
              <div className="text-gray-300 flex items-center">
                <User className="h-3 w-3 mr-1" />
                {apt.students} students
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerScheduler;