import React from 'react';

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

export default RemoveConfirmationPopup;