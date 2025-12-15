const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');


const ItemSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true, trim: true},
    name: { type: String, required: true },
    description: String,
    quantity: { type: Number, default: 0 },
    location: String,
    barcode: String
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
