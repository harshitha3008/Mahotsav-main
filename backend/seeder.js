// File: seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mahotsav');

// Import data
const importData = async () => {
  try {
    // Clear previous data
    await Admin.deleteMany();

    // Create initial admin
    await Admin.create({
      adminId: "sports",
      password: "sports123", // This will get hashed by the schema pre-save hook
      role: "core"
    }, {adminId: "culturals",
    password: "culturals123", // This will get hashed by the schema pre-save hook
    role: "core"});

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await Admin.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}