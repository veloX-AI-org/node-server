const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.post('/', async(req, res) => {
    const { userID, notebookID, SECRETE_TOKEN } = req.body;

    if (SECRETE_TOKEN != process.env.SECRETE_TOKEN) {
        res.json({
            message: "Invalid User"
        });
        return;
    };

    if (userID.length != 24) { return res.status(401).json({ success: false, message: "User does not exist" })};

    const user = await userModel.findOne({ _id: userID });
    
    if (!user) { return res.status(401).json({ success: false, message: "User does not exist" })};

    const notebook = user.notebooks.get(notebookID);
    
    if (!notebook) { return res.status(401).json({ success: false, message: "Notebook does not exist" })};
    
    res.json({ message: notebook.uploadedSourceSummary });
});

module.exports = router;