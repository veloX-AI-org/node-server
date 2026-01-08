const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

module.exports = isLoggedIn;
