const express = require('express');
const router = express.Router();

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
router.get('/listnotebooks', (req, res) => {
    res.render("ListNotebooks");
});

// Notebook Router
router.get('/notebook', (req, res) => {
    res.render("Notebook");
});

module.exports = router;