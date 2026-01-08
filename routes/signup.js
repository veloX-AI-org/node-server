const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { firstname, lastname, password } = req.body;

    console.log(firstname, lastname, password);
    res.send(200);
});

module.exports = router;