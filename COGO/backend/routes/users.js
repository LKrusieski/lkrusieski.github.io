const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');
const User = require('../models/User');

const VALID_ROLES = ['admin', 'manager', 'associate'];

router.use(authMiddleware, checkRole(['admin']));


router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { passwordHash: 0 }).sort({ username: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'username, password, and role are required' });
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Use admin or user.' });
        }

        const existing = await User.findOne({ username });
        if (existing) return res.status(409).json({ error: 'Username already exists' });

        const passwordHash = await bcrypt.hash(password, 10);

        const saved = await new User({ username, passwordHash, role }).save();

        res.status(201).json({ _id: saved._id, username: saved.username, role: saved.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { role, password } = req.body;

        const update = {};
        if (role) {
            if (!VALID_ROLES.includes(role)) {
                return res.status(400).json({ error: 'Invalid role. Use admin or user.' });
            }
            update.role = role;
        }
        if (password) {
            update.passwordHash = await bcrypt.hash(password, 10);
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, projection: { passwordHash: 0 } }
        );

        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        if (req.user?.userId === req.params.id) {
            return res.status(400).json({ error: 'You cannot delete your own account.' });
        }

        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
