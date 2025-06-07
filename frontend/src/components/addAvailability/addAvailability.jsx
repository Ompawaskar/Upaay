import React, { useState } from 'react';

const timeSlots = [
  '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM',
];

const subjectsList = ['English', 'Math', 'Lang'];

const getNext7Days = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
      value: date.toISOString().split('T')[0], // yyyy-mm-dd
    });
  }

  return dates;
};

const AddAvailability = () => {
  const volunteerId = ""; // keep this unchanged
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = () => {
    const availability = {
      volunteerId: volunteerId,
      date,
      timeSlot,
      subject,
    };

    console.log('Submitting availability:', availability);
    // Replace with your API call or logic
  };

  const next7Days = getNext7Days();

  return (
    <div className="p-4 bg-white max-w-md mx-auto rounded shadow-xl space-y-4">
      <h2 className="text-lg font-bold">Add Availability</h2>

      {/* Date */}
      <label className="block">Select Date:</label>
      <select
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select Date --</option>
        {next7Days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Time Slot */}
      <label className="block">Select Time Slot:</label>
      <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select Time Slot --</option>
        {timeSlots.map((slot, i) => (
          <option key={i} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {/* Subject */}
      <label className="block">Select Subject:</label>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select Subject --</option>
        {subjectsList.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Submit Availability
      </button>
    </div>
  );
};

export default AddAvailability;
