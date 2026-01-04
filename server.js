const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

app = express();
PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/pages'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});