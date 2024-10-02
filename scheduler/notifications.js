const cron = require('node-cron');
const Business = require('../models/Business');
const User = require('../models/User');
// Optional: Integrate an email service like nodemailer

// Schedule to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const businesses = await Business.find({
      contractExpiryDate: {
        $gte: threeDaysLater.setHours(0,0,0,0),
        $lt: threeDaysLater.setHours(23,59,59,999)
      },
      status: 'Approved'
    }).populate('user');

    businesses.forEach(business => {
      const user = business.user;
      const message = `Hello ${user.fullName}, your contract for "${business.businessName}" is expiring on ${business.contractExpiryDate.toDateString()}. Please renew your contract before the expiry date.`;

      // Send notification (e.g., email)
      console.log(`Notification to ${user.email}: ${message}`);
      // Implement email sending here if desired
    });

    console.log('Notifications checked and processed');
  } catch (err) {
    console.error('Error in notification scheduler:', err);
  }
});
