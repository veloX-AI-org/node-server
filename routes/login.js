const express = require('express');
const userModel = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/", async(req, res) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) { return res.status(401).json({ success: false, message: "User does not exist" })};

    bcrypt.compare(req.body.password, user.passwordHash, (err, success) => {
        if (err) { return res.status(500).send("Server Error: It's not you it's us.") };

        if (!success) { return res.status(401).send("Invalid email or password") };

        let token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie("token", token);
        res.redirect("/listnotebooks");
    });
});

module.exports = router;