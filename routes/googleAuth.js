const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

router.get('/google', (req, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
    });

    res.redirect(url);
});

router.get('/google/callback', async(req, res) => {
    const code = req.query.code;

    try{
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await userModel.findOne({ email: payload.email });

        if (!user) {
            user = await userModel.create({
                username: payload.name,
                fname: payload.given_name,
                lname: payload.family_name,
                email: payload.email,
                provider: "google",
                googleId: payload.sub,
                googleImageURL: payload.picture
            })
        }

        let token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true for (https)
        });

        res.redirect('/listnotebooks');
    } catch (e) {
        console.log(e);
        res.redirect('/login');
    }
});

module.exports = router;