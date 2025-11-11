const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // simple validation
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = new User({ name, email, passwordHash: password });
    await user.save();
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
