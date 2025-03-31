const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'RETURNED_FOR_UPDATE', 'PENDING_DECISION', 'CLOSED'],
    default: 'DRAFT'
  },
  incident: {
    date: {
      type: Date,
      required: true
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    involvedPeople: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String
    }]
  },
  submittedAt: Date,
  lastUpdatedAt: Date,
  decision: {
    principalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    punishment: String,
    notes: String,
    decidedAt: Date
  },
  history: [{
    action: {
      type: String,
      enum: ['CREATED', 'UPDATED', 'RETURNED', 'DECIDED']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ teacherId: 1 });
complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema); 