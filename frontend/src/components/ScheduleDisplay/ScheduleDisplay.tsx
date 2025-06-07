import React, { useState } from 'react';

const initialClasses = [
  {
    id: '1',
    date: '2025-06-09',
    subject: 'Math',
    timeSlot: '10:00 AM - 11:00 AM',
    volunteerName: 'Alice',
    level: 1
  },
  {
    id: '2',
    date: '2025-06-11',
    subject: 'Science',
    timeSlot: '11:00 AM - 12:00 PM',
    volunteerName: 'Bob',
    level: 2
  },
  {
    id: '3',
    date: '2025-06-12',
    subject: 'English',
    timeSlot: '2:00 PM - 3:00 PM',
    volunteerName: 'Carol',
    level: 3
  }
];

const volunteersDB = ['Alice', 'Bob', 'Carol', 'David'];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM',
];

const getDayIndex = (dateStr) => {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  return day === 0 ? 6 : day - 1;
};

const WeeklySchedule = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [form, setForm] = useState({ date: '', timeSlot: '', subject: '', volunteerName: '', level: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = () => {
    if (!volunteersDB.includes(form.volunteerName)) {
      setMessage('❌ Volunteer not found in the system.');
      return;
    }

    const newClass = {
      id: (classes.length + 1).toString(),
      ...form,
      level: parseInt(form.level),
    };

    setClasses([...classes, newClass]);
    setMessage('✅ Class added successfully.');
    setForm({ date: '', timeSlot: '', subject: '', volunteerName: '', level: '' });
  };

  return (
    <div className="p-4 bg-[#e9eaec] text-[#003c64] min-h-screen">
      <div className="mb-6 p-4 bg-white rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Add Manual Schedule</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <input type="date" name="date" value={form.date} onChange={handleInputChange} className="p-2 border rounded" />
          <select name="timeSlot" value={form.timeSlot} onChange={handleInputChange} className="p-2 border rounded">
            <option value="">Time Slot</option>
            {timeSlots.map((ts, i) => (
              <option key={i} value={ts}>{ts}</option>
            ))}
          </select>
          <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="volunteerName" placeholder="Volunteer Name" value={form.volunteerName} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="level" placeholder="Level" value={form.level} onChange={handleInputChange} className="p-2 border rounded" />
          <button onClick={handleAddSchedule} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Schedule</button>
        </div>
        {message && <p className="mt-2 text-sm font-medium">{message}</p>}
      </div>

      {/* Schedule Table */}
      <div className="grid grid-cols-[150px_repeat(7,_1fr)] border text-sm text-center">
        <div className="font-bold bg-gray-200 border p-2">Time / Day</div>
        {weekDays.map((day, idx) => (
          <div key={idx} className="font-bold bg-gray-200 border p-2">{day}</div>
        ))}
      </div>

      {timeSlots.map((slot, i) => (
        <div key={i} className="grid grid-cols-[150px_repeat(7,_1fr)] border">
          <div className="border p-2 font-medium bg-gray-100">{slot}</div>
          {weekDays.map((_, dayIdx) => {
            const classData = classes.find(
              (cls) =>
                getDayIndex(cls.date) === dayIdx && cls.timeSlot === slot
            );
            return (
              <div key={dayIdx} className="border p-1 h-24 text-xs text-left">
                {classData ? (
                  <div className="bg-[#f7ac2d] text-[#003c64] rounded p-2 h-full shadow-md">
                    <p className="font-bold">{classData.subject}</p>
                    <p>By: <span className="font-medium">{classData.volunteerName}</span></p>
                    <p>Level: {classData.level}</p>
                  </div>
                ) : (
                  <div className="text-[#003c64] text-[10px]">–</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeeklySchedule;
