import React, { useState, useEffect, useMemo } from 'react';
import { DUMMY_SCHEDULE_DATA, TIME_SLOTS, getNextSevenDays } from './subComponents/dummy.data';
import AddSchedulePopup from './subComponents/AddSchedulePopup';
import ScheduledInfoPopup from './subComponents/ScheduledInfoPopup';
import RemoveConfirmationPopup from './subComponents/RemoveConfirmationPopup';
// Assuming cityMappings.js exists in subComponents with CITIES_COORDINATES and getLatLngFromCity
import { CITIES_COORDINATES, getCityFromLatLng, getLatLngFromCity} from './subComponents/cityMappings';
const Calendar = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    // This `schedule` state will now hold ALL dummy data, regardless of city.
    // The filter will happen on the `filteredSchedule` computed property.
    const [schedule, setSchedule] = useState({});

    // State for the "Add Schedule" popup
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedEmptySlot, setSelectedEmptySlot] = useState(null);

    // State for the "Scheduled Info" popup
    const [showInfoPopup, setShowInfo] = useState(false);
    const [selectedScheduledEvent, setSelectedScheduledEvent] = useState(null);

    // State for the "Remove Schedule" confirmation popup
    const [showRemoveConfirmPopup, setShowRemoveConfirmPopup] = useState(false);
    const [eventToRemove, setEventToRemove] = useState(null);

    // NEW: State for the currently selected city from the dropdown
    // Initialize with the first city available in your CITIES_COORDINATES list
    const [selectedCityFilter, setSelectedCityFilter] = useState(CITIES_COORDINATES[0]?.city || 'Mumbai');


    useEffect(() => {
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

    // NEW: Use useMemo to create a filtered view of the schedule
    // This ensures only events for the selected city are displayed.
    const filteredSchedule = useMemo(() => {
        if (!selectedCityFilter) {
            return {}; // If no city selected (shouldn't happen with default), return empty
        }

        const newFilteredSchedule = {};
        for (const date in schedule) {
            for (const timeSlot in schedule[date]) {
                const event = schedule[date][timeSlot];
                // CONDITION: Only include events that match the selected city filter
                if (event.city === selectedCityFilter) {
                    if (!newFilteredSchedule[date]) {
                        newFilteredSchedule[date] = {};
                    }
                    newFilteredSchedule[date][timeSlot] = event;
                }
            }
        }
        return newFilteredSchedule;
    }, [schedule, selectedCityFilter]); // Re-compute when `schedule` or `selectedCityFilter` changes


    const handleEmptySlotClick = (date, timeSlot) => {
        setSelectedEmptySlot({ date, timeSlot });
        setShowAddPopup(true);
    };

    const handleScheduledCardClick = (eventDetails) => {
        setSelectedScheduledEvent(eventDetails);
        setShowInfo(true);
    };

    const handleRemoveIconClick = (e, eventDetails) => {
        e.stopPropagation();
        setEventToRemove(eventDetails);
        setShowRemoveConfirmPopup(true);
    };

    // MODIFIED: handleAddSchedule now uses the `selectedCityFilter` state
    const handleAddSchedule = (mentorName, subject, level) => {
        console.log(`Adding schedule for ${selectedEmptySlot.date}, ${selectedEmptySlot.timeSlot} in ${selectedCityFilter}:`);
        console.log(`Mentor: ${mentorName}, Subject: ${subject}, Level: ${level}`);

        // Get coordinates for the currently selected city
        const cityCoords = getLatLngFromCity(selectedCityFilter) || { latitude: 'N/A', longitude: 'N/A' };

        const newScheduleEntry = {
            _id: `dummy_${Date.now()}`,
            date: selectedEmptySlot.date,
            timeSlot: selectedEmptySlot.timeSlot,
            subject: subject,
            volunteerName: mentorName,
            level: parseInt(level, 10),
            city: selectedCityFilter, // Assign the currently selected city
            latitude: cityCoords.latitude,
            longitude: cityCoords.longitude,
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

    const handleRemoveSchedule = (eventToDelete) => {
        console.log('Attempting to remove schedule:', eventToDelete);
        setSchedule(prevSchedule => {
            const updatedSchedule = { ...prevSchedule };
            if (updatedSchedule[eventToDelete.date]) {
                delete updatedSchedule[eventToDelete.date][eventToDelete.timeSlot];
                if (Object.keys(updatedSchedule[eventToDelete.date]).length === 0) {
                    delete updatedSchedule[eventToDelete.date];
                }
            }
            return updatedSchedule;
        });

        setShowRemoveConfirmPopup(false);
        setEventToRemove(null);
    };

    const handleCloseAddPopup = () => {
        setShowAddPopup(false);
        setSelectedEmptySlot(null);
    };

    const handleCloseInfoPopup = () => {
        setShowInfo(false);
        setSelectedScheduledEvent(null);
    };

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header Section with Gradients and City Dropdown */}
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shadow-lg">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center md:text-left drop-shadow-md">
                        Mentor Session Calendar
                    </h1>
                    {/* NEW: City Filter Dropdown */}
                    <div className="flex items-center space-x-3">
                        <label htmlFor="cityFilter" className="text-lg font-medium whitespace-nowrap text-white text-opacity-90">View City:</label>
                        <div className="relative inline-block w-48">
                            <select
                                id="cityFilter"
                                className="block w-full pl-4 pr-10 py-2 text-base rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-md appearance-none bg-white text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                                value={selectedCityFilter}
                                onChange={(e) => setSelectedCityFilter(e.target.value)}
                            >
                                {/* Map through the CITIES_COORDINATES constant */}
                                {CITIES_COORDINATES.map(cityObj => (
                                    <option key={cityObj.city} value={cityObj.city}>
                                        {cityObj.city}
                                    </option>
                                ))}
                            </select>
                            {/* Custom arrow for select dropdown */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Navigation and Week Display */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <button
                        onClick={() => navigateWeek('prev')}
                        className="px-5 py-2 mb-3 sm:mb-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                    >
                        &larr; Previous Week
                    </button>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center">
                        {new Date(currentWeekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        <span className="mx-2 text-gray-400 font-normal">-</span>
                        {new Date(datesToDisplay[6]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => navigateWeek('next')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                    >
                        Next Week &rarr;
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid border border-gray-200 rounded-lg overflow-hidden shadow-inner m-4 lg:m-6">
                    {/* Calendar Header Row */}
                    <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <div className="col-span-1 p-3 font-semibold text-gray-700 text-left pl-6 hidden sm:flex items-center">Time Slots</div>
                        {datesToDisplay.map(dateStr => (
                            <div key={dateStr} className="col-span-1 p-2 sm:p-3 font-semibold text-gray-700 text-center flex flex-col items-center justify-center text-sm sm:text-base">
                                <span className="block">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                <span className="block text-xs text-gray-500">{new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar Rows for Time Slots */}
                    {TIME_SLOTS.map(timeSlot => (
                        <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                            <div className="col-span-1 p-3 font-medium text-gray-600 bg-gray-50 flex items-center justify-start pl-6 min-h-[90px] md:min-h-[100px] border-r border-gray-100 text-sm md:text-base">
                                {timeSlot}
                            </div>
                            {datesToDisplay.map(dateStr => {
                                // IMPORTANT: Accessing `filteredSchedule` here instead of `schedule`
                                const scheduleEntry = filteredSchedule[dateStr]?.[timeSlot];
                                const isScheduled = !!scheduleEntry;

                                return (
                                    <div
                                        key={`${dateStr}-${timeSlot}`}
                                        className={`relative col-span-1 p-2 md:p-3 min-h-[90px] md:min-h-[100px] flex flex-col justify-center items-center text-center border-l border-gray-100
                                            ${isScheduled
                                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer m-1.5'
                                                : 'bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer'
                                            }`}
                                        onClick={() => {
                                            if (isScheduled) {
                                                handleScheduledCardClick(scheduleEntry);
                                            } else {
                                                handleEmptySlotClick(dateStr, timeSlot);
                                            }
                                        }}
                                    >
                                        {isScheduled ? (
                                            <>
                                                <button
                                                    className="absolute top-1 right-1 text-white hover:text-red-200 text-lg p-1 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition duration-150 ease-in-out z-10"
                                                    onClick={(e) => handleRemoveIconClick(e, scheduleEntry)}
                                                    aria-label="Remove schedule"
                                                >
                                                    &#x2715;
                                                </button>
                                                <div className="text-sm md:text-base font-semibold">{scheduleEntry.volunteerName}</div>
                                                <div className="text-xs md:text-sm mt-1">{scheduleEntry.subject} - Lvl {scheduleEntry.level}</div>
                                                {/* Optionally display city on card for quick reference if desired */}
                                                <div className="text-xs text-opacity-80 mt-1">{scheduleEntry.city}</div>
                                            </>
                                        ) : (
                                            <button
                                                className="text-5xl text-gray-300 hover:text-gray-500 focus:outline-none transition duration-150 ease-in-out"
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
            </div>

            {/* Popups */}
            {showAddPopup && (
                <AddSchedulePopup
                    date={selectedEmptySlot.date}
                    timeSlot={selectedEmptySlot.timeSlot}
                    onClose={handleCloseAddPopup}
                    onAddSchedule={handleAddSchedule}
                />
            )}

            {showInfoPopup && selectedScheduledEvent && (
                <ScheduledInfoPopup
                    event={selectedScheduledEvent}
                    onClose={handleCloseInfoPopup}
                />
            )}

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

export default Calendar;