import React, { useState, useEffect } from 'react';

const AddSchedulePopup = ({ date, timeSlot, onClose, onAddSchedule }) => {
    const [mentorName, setMentorName] = useState('');
    const [subject, setSubject] = useState('Math');
    const [level, setLevel] = useState(1);
    const [availableVolunteers, setAvailableVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch available volunteers when component mounts
    useEffect(() => {
        fetchAvailableVolunteers();
    }, [date, timeSlot]);

    const fetchAvailableVolunteers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Format date for API call
            const formattedDate = new Date(date).toISOString().split('T')[0];
            
            const response = await fetch(
                `http://localhost:3000/api/volunteers/available?date=${formattedDate}&timeSlot=${encodeURIComponent(timeSlot)}`
            );
            console.log(response);
            
            const result = await response.json();
            
            if (result.success) {
                setAvailableVolunteers(result.data);
                // Auto-select first volunteer if available
                if (result.data.length > 0) {
                    setMentorName(result.data[0].name);
                }
            } else {
                setError(result.message || 'Failed to fetch volunteers');
            }
        } catch (err) {
            console.error('Error fetching volunteers:', err);
            setError('Failed to load available volunteers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mentorName.trim() && subject && level) {
            // Find selected volunteer details
            const selectedVolunteer = availableVolunteers.find(v => v.name === mentorName);
            onAddSchedule(mentorName, subject, level, selectedVolunteer);
        } else {
            alert('Please fill all fields.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Assign Mentor for {new Date(date).toLocaleDateString()} at {timeSlot}
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="mentorName" className="block text-gray-700 text-sm font-bold mb-2">
                            Available Mentors:
                        </label>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="text-gray-500">Loading available mentors...</div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-sm mb-2">
                                {error}
                                <button 
                                    type="button"
                                    onClick={fetchAvailableVolunteers}
                                    className="ml-2 text-blue-500 underline"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : availableVolunteers.length === 0 ? (
                            <div className="text-yellow-600 text-sm mb-2">
                                No volunteers available for this time slot
                            </div>
                        ) : (
                            <select
                                id="mentorName"
                                value={mentorName}
                                onChange={(e) => setMentorName(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                required
                            >
                                <option value="">Select a mentor...</option>
                                {availableVolunteers.map((volunteer) => (
                                    <option key={volunteer.volunteerId} value={volunteer.name}>
                                        {volunteer.name} {volunteer.subjects && volunteer.subjects.length > 0 && 
                                            `(${volunteer.subjects.join(', ')})`
                                        }
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        {/* Fallback manual input */}
                        <div className="mt-2">
                            <label className="block text-gray-600 text-xs mb-1">
                                Or enter manually:
                            </label>
                            <input
                                type="text"
                                value={mentorName}
                                onChange={(e) => setMentorName(e.target.value)}
                                placeholder="Enter mentor name manually"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                            Subject:
                        </label>
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
                        <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">
                            Level:
                        </label>
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
                            disabled={loading || (!mentorName.trim())}
                            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
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