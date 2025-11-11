const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const { validateBugData } = require('../utils/validators');

// Get all bugs
router.get('/', async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    next(error);
  }
});

// Get bug by ID
router.get('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      const error = new Error('Bug not found');
      error.status = 404;
      throw error;
    }
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    next(error);
  }
});

// Create new bug
router.post('/', async (req, res, next) => {
  try {
    const validatedData = validateBugData(req.body);
    const bug = new Bug(validatedData);
    await bug.save();

    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Update bug
router.put('/:id', async (req, res, next) => {
  try {
    const validatedData = validateBugData(req.body);
    const bug = await Bug.findByIdAndUpdate(req.params.id, validatedData, { new: true, runValidators: true });

    if (!bug) {
      const error = new Error('Bug not found');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
});

// Delete bug
router.delete('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      const error = new Error('Bug not found');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Bug deleted successfully',
      data: bug
    });
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
});

module.exports = router;