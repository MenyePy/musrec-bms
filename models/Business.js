const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessLocation: { type: String, required: true },
  businessType: { type: String, enum: ['Food', 'Electronics', 'Service'], required: true },
  businessDescription: { type: String, required: true },
  justificationLetter: { type: String },  // Can store text or link to uploaded file
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  adminMessage: { type: String }, // Message from admin upon review
  reviewedAt: { type: Date },
  contractStartDate: { type: Date },
  contractExpiryDate: { type: Date },
  rentStatus: {
    nextDueDate: Date,
    paidUntil: Date
  },
  createdAt: { type: Date, default: Date.now },
  documents: [
    {
      title: String,
      filePath: String
    }
  ]
});

module.exports = mongoose.model('Business', businessSchema);
