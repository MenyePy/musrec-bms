const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  nationalId: { type: String, required: true },
  districtOfOrigin: { type: String, required: true },
  homeAddress: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
  documents: [
    {
      title: String,
      fileUrl: String,
      uploadDate: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
