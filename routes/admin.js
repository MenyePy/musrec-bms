const express = require('express');
const Business = require('../models/Business');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// @route   GET /admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments({ status: 'Approved' });
    const totalApplications = await Business.countDocuments({ status: 'Pending' });
    const recentApplications = await Business.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', ['fullName', 'email']);

    res.json({
      totalBusinesses,
      totalApplications,
      recentApplications
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET /admin/applications
// @desc    Get all business applications
// @access  Admin
router.get('/applications', adminAuth, async (req, res) => {
  try {
    const applications = await Business.find()
      .populate('user', ['fullName', 'email', 'businesses'])
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PATCH /admin/applications/:id
// @desc    Approve or reject a business application
// @access  Admin
router.patch('/applications/:id', adminAuth, async (req, res) => {
  const { status, message } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ msg: 'Business application not found' });
    }

    business.status = status;
    business.adminMessage = message || '';
    business.reviewedAt = Date.now();

    if (status === 'Approved') {
      // Set contract dates
      business.contractStartDate = new Date();
      business.contractExpiryDate = new Date(Date.now() + 365*24*60*60*1000); // 1 year from now

      // Add business to user's businesses array
      const user = await User.findById(business.user);
      user.businesses.push(business._id);
      await user.save();
    }

    await business.save();

    res.json({ msg: `Business application ${status.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
