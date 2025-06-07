import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  submissionImage: {
    type: String,
    default: ''
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  gradedAt: {
    type: Date,
    default: Date.now
  }
});

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


  rollNo: {
    type: String,
    required: true,
    trim: true,
    unique: true
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
    ref: "ClassSchedule"
  }],
  level: Number,
  testResults: [testResultSchema]

}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;