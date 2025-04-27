const express = require('express');
const router = express.Router();
const Student = require('../models/Students');

// Test route
router.get('/test', (req, res) => {
  res.send('Student API is running 🚀');
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, studentId, department, enrollmentYear, dob, isActive } = req.body;
    
    // Simple validation
    if (!firstName || !lastName || !email || !studentId || !department || !enrollmentYear || !dob) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const student = new Student({
      firstName,
      lastName,
      email,
      studentId,
      department,
      enrollmentYear,
      dob,
      isActive: isActive ?? true // default to true if not provided
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

