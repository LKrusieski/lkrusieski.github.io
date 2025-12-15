const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' },
    total: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
