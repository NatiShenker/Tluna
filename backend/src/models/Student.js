const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema); 