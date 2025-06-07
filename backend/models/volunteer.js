import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
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
  qualification: {
    type: String,
    required: true,
    trim: true
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
  numberOfHours: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;