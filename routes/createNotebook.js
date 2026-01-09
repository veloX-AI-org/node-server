const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

const generateUUID = () => { return crypto.randomUUID() };

router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { notebookName } = req.body;

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const id = generateUUID();

        const newNotebook = {
            notebookID: id,
            name: notebookName,
            date: new Date(),
            summary: "Add sources to get summary."
        };

        user.notebooks.set(id, newNotebook);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Notebook Created",
            id: id
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create notebook"
        });
    }
});

module.exports = router;