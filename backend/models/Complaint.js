const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'RETURNED_FOR_UPDATE', 'CLOSED'],
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
    }
  },
  decision: {
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    punishment: {
      type: String
    },
    notes: {
      type: String
    },
    date: {
      type: Date
    }
  },
  history: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint; 