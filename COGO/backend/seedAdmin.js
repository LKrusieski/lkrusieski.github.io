require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const username = "admin";
        const password = "password123";  // temporary password
        const role = "admin";

        const existing = await User.findOne({ username });
        if (existing) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const admin = new User({
            username,
            passwordHash,
            role
        });

        await admin.save();
        console.log("Admin user created successfully");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
