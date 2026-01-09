const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user');

// Home Router
router.get('/', (req, res) => {
    res.render("Home");
});

// Login Router
router.get('/login', (req, res) => {
    res.render("Login");
});

// Signup Router
router.get('/signup', (req, res) => {
    res.render("Signup");
});

// List Notebooks Router
router.get('/listnotebooks', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const allNotebooks = Array.from(user.notebooks.values());
    res.render("ListNotebooks", { notebooks: allNotebooks });
});

// Notebook Router
router.get('/notebook', isLoggedIn, (req, res) => {
    res.render("Notebook");
});

router.get('/logout', isLoggedIn, (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

module.exports = router;