// src/components/ScheduledInfoPopup.jsx

import React from 'react';
// Removed import: import { getCityFromLatLng } from '../data/cityMappings';

const ScheduledInfoPopup = ({ event, onClose }) => {
    // CHANGE: Directly use event.city
    const cityName = event.city || 'Location Not Specified'; // Use event.city directly

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
                    {/* Display ONLY the city name from event.city */}
                    <p className="text-lg">
                        <strong>Location:</strong> {cityName}
                    </p>
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

export default ScheduledInfoPopup;