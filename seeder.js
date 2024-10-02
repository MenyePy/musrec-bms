const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/business-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log(err));

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword', salt);

    const admin = new User({
      fullName: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      phoneNumber: '0000000000',
      nationalId: 'ADMIN12345',
      districtOfOrigin: 'Admin District',
      homeAddress: 'Admin Address',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
