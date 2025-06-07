import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  },
  centerLocation: {
    type: String,
    required: false,
    trim: true
  },
  maxMarks: {
    type: Number,
    required: false,
    min: 0,
    default: 100
  },
  imageLink: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

const Test = mongoose.model('Test', testSchema);

export default Test;