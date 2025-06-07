// subComponents/dummy.data.js

// IMPORTANT: getLatLngFromCity is NOT used in DUMMY_SCHEDULE_DATA here,
// but it is still needed and used by Calendar.jsx for adding new schedules.
// Ensure your cityMappings.js file (from previous steps) is correctly configured
// and provides CITIES_COORDINATES and getLatLngFromCity.

export const DUMMY_SCHEDULE_DATA = [
    // Mumbai Schedules
    {
        _id: 'sch_mumbai_1',
        date: '2025-06-09', // Monday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'Math',
        volunteerName: 'Rohan Sharma',
        level: 3,
        city: 'Mumbai',
        // latitude and longitude removed as per instruction
    },
    {
        _id: 'sch_mumbai_2',
        date: '2025-06-09', // Monday
        timeSlot: '11:00 AM - 12:00 PM',
        subject: 'English',
        volunteerName: 'Priya Singh',
        level: 2,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_3',
        date: '2025-06-10', // Tuesday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'Science',
        volunteerName: 'Amit Patel',
        level: 4,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_4',
        date: '2025-06-10', // Tuesday
        timeSlot: '2:00 PM - 3:00 PM',
        subject: 'Physics',
        volunteerName: 'Deepa Rao',
        level: 5,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_5',
        date: '2025-06-11', // Wednesday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'Chemistry',
        volunteerName: 'Vikram Mehta',
        level: 3,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_6',
        date: '2025-06-11', // Wednesday
        timeSlot: '1:00 PM - 2:00 PM',
        subject: 'History',
        volunteerName: 'Sneha Gupta',
        level: 2,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_7',
        date: '2025-06-12', // Thursday
        timeSlot: '11:00 AM - 12:00 PM',
        subject: 'Economics',
        volunteerName: 'Kiran Reddy',
        level: 4,
        city: 'Mumbai',
    },
    {
        _id: 'sch_mumbai_8',
        date: '2025-06-13', // Friday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'Biology',
        volunteerName: 'Rahul Verma',
        level: 3,
        city: 'Mumbai',
    },

    // Delhi Schedules
    {
        _id: 'sch_delhi_1',
        date: '2025-06-09', // Monday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'English',
        volunteerName: 'Anjali Desai',
        level: 2,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_2',
        date: '2025-06-09', // Monday
        timeSlot: '2:00 PM - 3:00 PM',
        subject: 'Geography',
        volunteerName: 'Suresh Kumar',
        level: 1,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_3',
        date: '2025-06-10', // Tuesday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'Computer Science',
        volunteerName: 'Geeta Sharma',
        level: 4,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_4',
        date: '2025-06-11', // Wednesday
        timeSlot: '10:00 AM - 11:00 AM',
        subject: 'Math',
        volunteerName: 'Ajay Dixit',
        level: 3,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_5',
        date: '2025-06-11', // Wednesday
        timeSlot: '3:00 PM - 4:00 PM',
        subject: 'Hindi',
        volunteerName: 'Nisha Singhania',
        level: 1,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_6',
        date: '2025-06-12', // Thursday
        timeSlot: '9:00 AM - 10:00 AM',
        subject: 'English Literature',
        volunteerName: 'Rajesh Khanna',
        level: 5,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_7',
        date: '2025-06-12', // Thursday
        timeSlot: '1:00 PM - 2:00 PM',
        subject: 'Political Science',
        volunteerName: 'Smita Nagar',
        level: 3,
        city: 'Delhi',
    },
    {
        _id: 'sch_delhi_8',
        date: '2025-06-13', // Friday
        timeSlot: '11:00 AM - 12:00 PM',
        subject: 'Physical Education',
        volunteerName: 'Manoj Yadav',
        level: 2,
        city: 'Delhi',
    },
];

export const TIME_SLOTS = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
];

export const getNextSevenDays = (startDate = new Date()) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};