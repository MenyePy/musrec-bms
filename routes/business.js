const express = require('express');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/business/upload
// @desc    Upload document
// @access  Private
router.post('/upload', [auth, upload.single('document')], (req, res) => {
  try {
    res.json({
      msg: 'File uploaded successfully',
      filePath: req.file.path
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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
