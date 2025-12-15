const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

/**
 * GET all orders
 */
router.get('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Order

router.post('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const order = new Order(req.body);
        const saved = await order.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * GET one order by id
 */
router.get('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('customerId');

        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * DELETE order (admin only)
 */
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
