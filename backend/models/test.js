import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: false,
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: false,
    trim: true
  },
  marks: {
    type: Number,
    default: 1,
    min: 0
  }
});

const testSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: false,
    trim: true
  },
  subject: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date,
    required: false
  },
  centerLocation: {
    type: String,
    required: false,
    trim: true
  },
  maxMarks: {
    type: Number,
    required: false,
    min: 0
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

const Test = mongoose.model('Test', testSchema);

export default Test;