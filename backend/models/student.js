import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String, // URL to the image
    default: ''
  },
  feedback: [{
    comment: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
   location:{
    type: String,
    required: true,
    trim: true
   },
   attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "ClassSchedule"
   }],
   level: Number
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;