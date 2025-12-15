const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

// GET /items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /items/:id
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE item
router.put('/:id', authMiddleware, checkRole(['admin', 'manager', 'associate']), async (req, res) => {
    try {
        const { SKU, name, description, quantity } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { SKU, name, description, quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(updatedItem);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating item" });
    }
});

// DELETE item
router.delete('/:id',authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error deleting item" });
    }
});


// CREATE item
router.post('/', authMiddleware, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const { sku, name, description, quantity } = req.body;

        if (!sku || !name || !quantity) {
            return res.status(400).json({ error: "SKU, Name, and quantity are required." });
        }

        const newItem = new Item({
            sku,
            name,
            description: description || "",
            quantity
        });

        const saved = await newItem.save();
        res.status(201).json(saved);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error creating item" });
    }
});


module.exports = router;
