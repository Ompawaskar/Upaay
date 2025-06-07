// src/data/dummyData.js

// No need to import getLatLngFromCity here if we are explicitly defining 'city'
// for the dummy data. If you were generating this data dynamically, you might still use it.

export const DUMMY_SCHEDULE_DATA = [
    {
        _id: 'schedule1',
        date: '2025-06-09', // Monday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'Math',
        volunteerName: 'John Doe',
        level: 3,
        city: 'Mumbai', // Explicitly setting the city
        backupId: 'backup123'
    },
    {
        _id: 'schedule2',
        date: '2025-06-10', // Tuesday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'English',
        volunteerName: 'Jane Smith',
        level: 2,
        city: 'Delhi', // Explicitly setting the city
        backupId: null
    },
    {
        _id: 'schedule3',
        date: '2025-06-10', // Tuesday
        timeSlot: '11:00 AM - 12:00 PM',
        subject: 'Lang',
        volunteerName: 'Peter Jones',
        level: 1,
        city: 'Mumbai', // Explicitly setting the city
        backupId: 'backup456'
    },
    {
        _id: 'schedule4',
        date: '2025-06-12', // Thursday
        timeSlot: '1:00 PM - 2:00 PM',
        subject: 'Math',
        volunteerName: 'Alice Brown',
        level: 4,
        city: 'Mumbai', // Explicitly setting the city
        backupId: null
    },
    {
        _id: 'schedule5',
        date: '2025-06-13', // Friday
        timeSlot: '2:00 PM - 3:00 PM',
        subject: 'Science',
        volunteerName: 'David Lee',
        level: 3,
        city: 'Delhi', // Explicitly setting the city
        backupId: 'backup789'
    }
];

export const TIME_SLOTS = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
];

// This part should ideally be in a `dateHelpers.js` file if you have one.
// Keeping it here as per your provided context.
export const getNextSevenDays = (startDate = new Date()) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};