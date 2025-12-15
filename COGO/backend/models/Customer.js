const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            zip: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
