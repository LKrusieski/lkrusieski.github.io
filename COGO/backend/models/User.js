const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'associate'],
        default: 'associate'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
