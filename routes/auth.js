const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// User Registration
router.post('/register', [
  check('fullName', 'Full Name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], async (req, res) => {
    const { fullName, username, email, phoneNumber, nationalId, district, homeAddress, password } = req.body;
    
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }
  
      user = new User({
        fullName,
        username,
        email,
        phoneNumber,
        nationalId,
        district,
        homeAddress,
        password
      });
  
      // Encrypt the password and save the user
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
  
      // Return JWT
      const payload = {
        user: {
          id: user.id
        }
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// User Login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
    
        // Return JWT
        const payload = {
          user: {
            id: user.id
          }
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
    
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
  });

module.exports = router;
