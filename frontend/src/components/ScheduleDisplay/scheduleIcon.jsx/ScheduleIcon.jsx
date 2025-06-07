import React, { useState, useEffect } from 'react';

// Dummy data for demonstration
const DUMMY_SCHEDULE_DATA = [
    {
        _id: 'schedule1',
        date: '2025-06-09', // Monday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'Math',
        volunteerName: 'John Doe',
        level: 3,
        latitude: '34.0522', // Added dummy data
        longitude: '-118.2437', // Added dummy data
        backupId: 'backup123' // Added dummy data
    },
    {
        _id: 'schedule2',
        date: '2025-06-10', // Tuesday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'English',
        volunteerName: 'Jane Smith',
        level: 2,
        latitude: '40.7128',
        longitude: '-74.0060',
        backupId: null // No backup
    },
    {
        _id: 'schedule3',
        date: '2025-06-10', // Tuesday
        timeSlot: '11:00 AM - 12:00 PM',
        subject: 'Lang',
        volunteerName: 'Peter Jones',
        level: 1,
        latitude: '51.5074',
        longitude: '0.1278',
        backupId: 'backup456'
    },
    {
        _id: 'schedule4',
        date: '2025-06-12', // Thursday
        timeSlot: '1:00 PM - 2:00 PM',
        subject: 'Math',
        volunteerName: 'Alice Brown',
        level: 4,
        latitude: '35.6895',
        longitude: '139.6917',
        backupId: null
    }
];

// Helper function to get dates for the next 7 days
const getNextSevenDays = (startDate = new Date()) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        // Format as YYYY-MM-DD for easy comparison with schedule data
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

const TIME_SLOTS = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    // ... add more time slots as needed
];

const Calendar = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [schedule, setSchedule] = useState({}); // Stores schedule indexed by date and timeSlot

    // State for the "Add Schedule" popup (when clicking empty slot)
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedEmptySlot, setSelectedEmptySlot] = useState(null); // { date, timeSlot } for the empty slot

    // State for the "Scheduled Info" popup (when clicking a scheduled card)
    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const [selectedScheduledEvent, setSelectedScheduledEvent] = useState(null); // Stores the full event object

    // NEW: State for the "Remove Schedule" confirmation popup
    const [showRemoveConfirmPopup, setShowRemoveConfirmPopup] = useState(false);
    const [eventToRemove, setEventToRemove] = useState(null); // Stores the event to be removed

    useEffect(() => {
        // In a real application, you'd fetch this from your API
        const processedSchedule = {};
        DUMMY_SCHEDULE_DATA.forEach(item => {
            if (!processedSchedule[item.date]) {
                processedSchedule[item.date] = {};
            }
            processedSchedule[item.date][item.timeSlot] = item;
        });
        setSchedule(processedSchedule);
    }, []);

    const datesToDisplay = getNextSevenDays(currentWeekStart);

    // Handler for clicking an EMPTY calendar slot (to add new schedule)
    const handleEmptySlotClick = (date, timeSlot) => {
        setSelectedEmptySlot({ date, timeSlot });
        setShowAddPopup(true);
    };

    // Handler for clicking a SCHEDULED calendar card (to view more info)
    const handleScheduledCardClick = (eventDetails) => {
        setSelectedScheduledEvent(eventDetails);
        setShowInfoPopup(true);
    };

    // NEW: Handler for clicking the 'X' to initiate schedule removal
    const handleRemoveIconClick = (e, eventDetails) => {
        e.stopPropagation(); // Prevent the parent card's onClick (info popup) from firing
        setEventToRemove(eventDetails);
        setShowRemoveConfirmPopup(true);
    };

    // Dummy function to add a schedule entry (frontend update only)
    const handleAddSchedule = (mentorName, subject, level) => {
        console.log(`Adding schedule for ${selectedEmptySlot.date}, ${selectedEmptySlot.timeSlot}:`);
        console.log(`Mentor: ${mentorName}, Subject: ${subject}, Level: ${level}`);

        const newScheduleEntry = {
            _id: `dummy_${Date.now()}`,
            date: selectedEmptySlot.date,
            timeSlot: selectedEmptySlot.timeSlot,
            subject: subject,
            volunteerName: mentorName,
            level: parseInt(level, 10),
            latitude: 'N/A', // Dummy values for new entries
            longitude: 'N/A',
            backupId: null
        };

        setSchedule(prevSchedule => {
            const updatedSchedule = { ...prevSchedule };
            if (!updatedSchedule[selectedEmptySlot.date]) {
                updatedSchedule[selectedEmptySlot.date] = {};
            }
            updatedSchedule[selectedEmptySlot.date][selectedEmptySlot.timeSlot] = newScheduleEntry;
            return updatedSchedule;
        });

        setShowAddPopup(false);
        setSelectedEmptySlot(null);
    };

    // NEW: Function to remove a schedule entry
    const handleRemoveSchedule = (eventToDelete) => {
        console.log('Attempting to remove schedule:', eventToDelete);
        // --- SCOPE FOR BACKEND CALL ---
        // In a real application, you'd make an API call here:
        // axios.delete(`/api/schedule/${eventToDelete._id}`)
        //   .then(response => {
        //     console.log('Schedule removed successfully on backend:', response.data);
        //     // Then update frontend state
        //   })
        //   .catch(error => {
        //     console.error('Error removing schedule on backend:', error);
        //     // Handle error (e.g., show an alert)
        //   });
        // -----------------------------

        setSchedule(prevSchedule => {
            const updatedSchedule = { ...prevSchedule };
            if (updatedSchedule[eventToDelete.date]) {
                delete updatedSchedule[eventToDelete.date][eventToDelete.timeSlot];
                // If no more entries for that date, clean up the date key
                if (Object.keys(updatedSchedule[eventToDelete.date]).length === 0) {
                    delete updatedSchedule[eventToDelete.date];
                }
            }
            return updatedSchedule;
        });

        setShowRemoveConfirmPopup(false); // Close the confirmation popup
        setEventToRemove(null); // Clear the event to remove
    };

    // Close handler for the "Add Schedule" popup
    const handleCloseAddPopup = () => {
        setShowAddPopup(false);
        setSelectedEmptySlot(null);
    };

    // Close handler for the "Scheduled Info" popup
    const handleCloseInfoPopup = () => {
        setShowInfoPopup(false);
        setSelectedScheduledEvent(null);
    };

    // NEW: Close handler for the "Remove Schedule Confirmation" popup
    const handleCloseRemoveConfirmPopup = () => {
        setShowRemoveConfirmPopup(false);
        setEventToRemove(null);
    };

    const navigateWeek = (direction) => {
        const newStartDate = new Date(currentWeekStart);
        newStartDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newStartDate);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigateWeek('prev')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    &lt; Prev Week
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">
                    Week of {new Date(currentWeekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h2>
                <button
                    onClick={() => navigateWeek('next')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Next Week &gt;
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid border border-gray-300 rounded-lg overflow-hidden shadow-md">
                {/* Calendar Header Row */}
                <div className="grid grid-cols-8 bg-gray-100 border-b border-gray-300">
                    <div className="col-span-1 p-3 font-semibold text-gray-700 text-left pl-6">Time Slots</div>
                    {datesToDisplay.map(dateStr => (
                        <div key={dateStr} className="col-span-1 p-3 font-semibold text-gray-700 text-center">
                            {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                    ))}
                </div>

                {/* Calendar Rows for Time Slots */}
                {TIME_SLOTS.map(timeSlot => (
                    <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                        {/* Time Slot Label */}
                        <div className="col-span-1 p-3 font-medium text-gray-600 bg-gray-50 flex items-center justify-start pl-6 min-h-[80px]">
                            {timeSlot}
                        </div>
                        {/* Daily Cells for each Time Slot */}
                        {datesToDisplay.map(dateStr => {
                            const scheduleEntry = schedule[dateStr]?.[timeSlot];
                            const isScheduled = !!scheduleEntry;

                            return (
                                <div
                                    key={`${dateStr}-${timeSlot}`}
                                    className={`relative col-span-1 p-3 min-h-[80px] flex flex-col justify-center items-center border-l border-gray-200
                                            ${isScheduled
                                                ? 'bg-[#f7ac2d] text-[#003c64] font-semibold cursor-pointer transition duration-150 ease-in-out hover:brightness-95'
                                                : 'bg-white hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out'
                                            }`}
                                    onClick={() => {
                                        if (isScheduled) {
                                            handleScheduledCardClick(scheduleEntry); // Click scheduled card
                                        } else {
                                            handleEmptySlotClick(dateStr, timeSlot); // Click empty slot
                                        }
                                    }}
                                >
                                    {isScheduled ? (
                                        <>
                                            <button
                                                className="absolute top-1 right-1 text-gray-800 hover:text-red-600 text-lg p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition duration-150 ease-in-out"
                                                onClick={(e) => handleRemoveIconClick(e, scheduleEntry)}
                                                aria-label="Remove schedule"
                                            >
                                                &#x2715; {/* Unicode 'X' mark */}
                                            </button>
                                            <div className="text-sm md:text-base">{scheduleEntry.volunteerName}</div>
                                            <div className="text-xs md:text-sm mt-1">{scheduleEntry.subject} - Level {scheduleEntry.level}</div>
                                        </>
                                    ) : (
                                        <button
                                            className="text-4xl text-gray-400 hover:text-gray-600 focus:outline-none"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent div's onClick from firing
                                                handleEmptySlotClick(dateStr, timeSlot);
                                            }}
                                            aria-label={`Add schedule for ${new Date(dateStr).toLocaleDateString()} at ${timeSlot}`}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Add Schedule Popup (for empty slots) */}
            {showAddPopup && (
                <AddSchedulePopup
                    date={selectedEmptySlot.date}
                    timeSlot={selectedEmptySlot.timeSlot}
                    onClose={handleCloseAddPopup}
                    onAddSchedule={handleAddSchedule}
                />
            )}

            {/* Scheduled Info Popup (for scheduled cards) */}
            {showInfoPopup && selectedScheduledEvent && (
                <ScheduledInfoPopup
                    event={selectedScheduledEvent}
                    onClose={handleCloseInfoPopup}
                />
            )}

            {/* NEW: Remove Schedule Confirmation Popup */}
            {showRemoveConfirmPopup && eventToRemove && (
                <RemoveConfirmationPopup
                    event={eventToRemove}
                    onConfirm={() => handleRemoveSchedule(eventToRemove)}
                    onCancel={handleCloseRemoveConfirmPopup}
                />
            )}
        </div>
    );
};

// AddSchedulePopup Component (unchanged, uses Tailwind CSS)
const AddSchedulePopup = ({ date, timeSlot, onClose, onAddSchedule }) => {
    const [mentorName, setMentorName] = useState('');
    const [subject, setSubject] = useState('Math'); // Default subject
    const [level, setLevel] = useState(1); // Default level

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mentorName.trim() && subject && level) { // Basic validation
            onAddSchedule(mentorName, subject, level);
        } else {
            alert('Please fill all fields.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Assign Mentor for {new Date(date).toLocaleDateString()} at {timeSlot}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="mentorName" className="block text-gray-700 text-sm font-bold mb-2">Mentor Name:</label>
                        <input
                            type="text"
                            id="mentorName"
                            value={mentorName}
                            onChange={(e) => setMentorName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
                        <select
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        >
                            <option value="Math">Math</option>
                            <option value="English">English</option>
                            <option value="Lang">Lang</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">Level:</label>
                        <input
                            type="number"
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            min="1"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        >
                            Assign
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ScheduledInfoPopup Component (unchanged, uses Tailwind CSS)
const ScheduledInfoPopup = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Schedule Details</h3>
                <div className="space-y-4 text-gray-700">
                    <p className="text-lg"><strong>Volunteer:</strong> <span className="font-semibold">{event.volunteerName}</span></p>
                    <p className="text-lg"><strong>Subject:</strong> <span className="font-semibold">{event.subject}</span></p>
                    <p className="text-lg"><strong>Level:</strong> <span className="font-semibold">{event.level}</span></p>
                    <p className="text-lg">
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-lg"><strong>Time Slot:</strong> {event.timeSlot}</p>
                    {event.latitude && event.longitude && (
                        <p className="text-lg">
                            <strong>Location:</strong> {event.latitude}, {event.longitude}
                        </p>
                    )}
                    {event.backupId && (
                        <p className="text-lg"><strong>Backup ID:</strong> {event.backupId}</p>
                    )}
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// RemoveConfirmationPopup Component (unchanged, uses Tailwind CSS)
const RemoveConfirmationPopup = ({ event, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirm Removal</h3>
                <p className="text-gray-700 text-center mb-8">
                    Are you sure you want to remove the schedule for <br />
                    <span className="font-semibold">{event.volunteerName} ({event.subject} - Level {event.level})</span> <br />
                    on <span className="font-semibold">{new Date(event.date).toLocaleDateString()}</span> at <span className="font-semibold">{event.timeSlot}</span>?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Remove
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export the main Calendar component as the default export
export default Calendar;