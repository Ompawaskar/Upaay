import React, { useState } from 'react';

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

export default AddSchedulePopup;