const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const Location = require('../models/Location');

// Get all complaints (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Teachers can only see their own complaints
    if (req.user.role === 'TEACHER') {
      query.teacherId = req.user._id;
    }
    
    const complaints = await Complaint.find(query)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'name')
      .populate('incident.locationId', 'name')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single complaint
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'firstName lastName studentId')
      .populate('teacherId', 'name')
      .populate('incident.locationId', 'name')
      .populate('incident.involvedPeople.userId', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has access to this complaint
    if (req.user.role === 'TEACHER' && complaint.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new complaint
router.post('/', auth, checkRole(['TEACHER']), [
  body('studentId').isMongoId(),
  body('incident.date').isISO8601(),
  body('incident.locationId').isMongoId(),
  body('incident.description').notEmpty(),
  body('incident.involvedPeople').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = new Complaint({
      ...req.body,
      teacherId: req.user._id,
      history: [{
        action: 'CREATED',
        userId: req.user._id,
        notes: 'Complaint created'
      }]
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint
router.put('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has access to update this complaint
    if (req.user.role === 'TEACHER' && complaint.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow updates if complaint is in DRAFT or RETURNED_FOR_UPDATE status
    if (!['DRAFT', 'RETURNED_FOR_UPDATE'].includes(complaint.status)) {
      return res.status(400).json({ message: 'Cannot update complaint in current status' });
    }

    Object.assign(complaint, req.body);
    complaint.lastUpdatedAt = new Date();
    complaint.history.push({
      action: 'UPDATED',
      userId: req.user._id,
      notes: 'Complaint updated'
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit complaint
router.post('/:id/submit', auth, checkRole(['TEACHER']), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (complaint.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Only draft complaints can be submitted' });
    }

    complaint.status = 'SUBMITTED';
    complaint.submittedAt = new Date();
    complaint.history.push({
      action: 'UPDATED',
      userId: req.user._id,
      notes: 'Complaint submitted'
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Principal decision
router.post('/:id/decide', auth, checkRole(['PRINCIPAL']), [
  body('punishment').notEmpty(),
  body('notes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'SUBMITTED') {
      return res.status(400).json({ message: 'Only submitted complaints can be decided' });
    }

    complaint.status = 'CLOSED';
    complaint.decision = {
      principalId: req.user._id,
      punishment: req.body.punishment,
      notes: req.body.notes,
      decidedAt: new Date()
    };
    complaint.history.push({
      action: 'DECIDED',
      userId: req.user._id,
      notes: 'Complaint decided'
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Return complaint for update
router.post('/:id/return', auth, checkRole(['PRINCIPAL']), [
  body('notes').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'SUBMITTED') {
      return res.status(400).json({ message: 'Only submitted complaints can be returned' });
    }

    complaint.status = 'RETURNED_FOR_UPDATE';
    complaint.history.push({
      action: 'RETURNED',
      userId: req.user._id,
      notes: req.body.notes
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 