const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');


dotenv.config();

app = express();
PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// Routes
app.use('/', require('./routes/pages'));
app.use('/login', require('./routes/login'));
app.use('/send-otp', require('./routes/sendOTP'));
app.use('/signup', require('./routes/signup'));
app.use('/auth', require('./routes/googleAuth'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});