import mongoose from 'mongoose';


const classScheduleSchema = new mongoose.Schema({
  date: Date,
  subject: String,
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  timeSlot: String,
  location: String,
  level: Number,
});

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);