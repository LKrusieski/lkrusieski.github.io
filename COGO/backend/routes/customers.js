const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

// GET /customers
router.get('/',authMiddleware, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ name: 1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /customers/:id
router.get('/:id',authMiddleware, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE /customers  (admin/manager)
router.post('/', authMiddleware, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required.' });
        }

        const saved = await new Customer({
            name,
            email,
            phone: phone || '',
            address: address || {}
        }).save();

        res.status(201).json(saved);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        res.status(500).json({ error: err.message });
    }

});

router.put('/:id', authMiddleware, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const update = { name, email, phone };
        if (address) update.address = address;

        const updated = await Customer.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(updated);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
});


// DELETE /customers/:id  (admin only — change if you want)
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const deleted = await Customer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
