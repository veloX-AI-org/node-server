const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

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
router.get('/listnotebooks', isLoggedIn, (req, res) => {
    res.render("ListNotebooks");
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