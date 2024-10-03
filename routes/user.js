const express = require('express');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /user/dashboard
// @desc    Get user dashboard data
// @access  Private (authenticated users only)
router.get('/dashboard', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      const business = await Business.findOne({ user: req.user.id });
  
      if (!business) {
        return res.status(400).json({ msg: 'No business application found' });
      }
  
      const dashboardData = {
        fullName: user.fullName,
        email: user.email,
        businessName: business.name,
        applicationStatus: business.status,
        contractDetails: business.contract,  // Include contract info if it exists
        rentStatus: business.rentStatus,  // Include rent status details
      };
  
      res.json(dashboardData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PATCH /user/profile
// @desc    Update user profile details
// @access  User
router.patch('/profile', auth, async (req, res) => {
  const { fullName, phoneNumber, homeAddress } = req.body;

  const updatedFields = {};
  if (fullName) updatedFields.fullName = fullName;
  if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
  if (homeAddress) updatedFields.homeAddress = homeAddress;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST /user/documents
// @desc    Upload business-related documents
// @access  User
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/documents/',
  filename: function(req, file, cb){
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000}, // 1MB limit
  fileFilter: function(req, file, cb){
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if(extname){
      return cb(null, true);
    } else {
      cb('Error: Files of type JPEG, PNG, PDF, DOC, DOCX only!');
    }
  }
}).single('document');

// Handle document upload
router.post('/documents', auth, (req, res) => {
  upload(req, res, async (err) => {
    if(err){
      return res.status(400).json({ msg: err });
    } else {
      const { title } = req.body;
      if(!title || !req.file){
        return res.status(400).json({ msg: 'Title and document are required' });
      }

      try {
        const user = await User.findById(req.user.id);
        user.documents.push({
          title,
          fileUrl: `/uploads/documents/${req.file.filename}`
        });
        await user.save();
        res.json({ msg: 'Document uploaded successfully', document: user.documents[user.documents.length - 1] });
      } catch (error) {
        res.status(500).send('Server error');
      }
    }
  });
});

module.exports = router;
