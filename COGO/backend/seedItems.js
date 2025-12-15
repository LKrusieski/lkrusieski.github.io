require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');

async function seedItems() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const items = [
            {
                name: "Ballpoint Pens (Pack of 12)",
                description: "Blue medium-point ballpoint pens for everyday office use.",
                quantity: 48
            },
            {
                name: "Stapler",
                description: "Standard black metal stapler compatible with 1/4\" staples.",
                quantity: 15
            },
            {
                name: "Staple Refills (Box of 5000)",
                description: "1/4\" standard staples for use in most desktop staplers.",
                quantity: 30
            },
            {
                name: "Printer Paper (500 Sheets)",
                description: "8.5 x 11 inch multipurpose white printer paper, 20 lb weight.",
                quantity: 100
            },
            {
                name: "Sticky Notes (Pack of 10)",
                description: "Assorted color sticky notes, 3x3 inch, 100 sheets per pad.",
                quantity: 25
            },
            {
                name: "Highlighters (Set of 6)",
                description: "Fluorescent highlighters in assorted colors.",
                quantity: 20
            },
            {
                name: "Desk Organizer",
                description: "Multi-compartment black mesh organizer for pens, notes, and paperclips.",
                quantity: 10
            }
        ];

        for (let item of items) {
            const exists = await Item.findOne({ name: item.name });
            if (!exists) {
                await Item.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Skipped (already exists): ${item.name}`);
            }
        }

        console.log("Office supply item seeding complete.");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedItems();
