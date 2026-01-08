const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

require('dotenv').config();

router.post('/', async(req, res) => {
    try {
        const { firstname, lastname, email, password, provider } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username: firstname + " " + lastname,
            fname: firstname,
            lname: lastname,
            email: email,
            passwordHash: hash,
            provider: provider,
        })

        let token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        res.cookie("token", token);
        res.status(200).json({ success: true, message: "User Registered Successfully."})
    } catch (err) {
        res.status(500).json({ success: false, message: err.message});
    }
});

module.exports = router;