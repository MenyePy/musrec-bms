const express = require('express');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const router = express.Router();

// Business Application Submission
router.post('/submit', auth, async (req, res) => {
  const { businessName, businessLocation, businessType, businessDescription, justificationLetter } = req.body;

  try {
    const newBusiness = new Business({
      user: req.user.id,
      businessName,
      businessLocation,
      businessType,
      businessDescription,
      justificationLetter
    });

    await newBusiness.save();
    res.status(201).json({ msg: 'Business application submitted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
