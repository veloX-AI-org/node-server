const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user');

router.get('/:notebookID', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let currentNotebook = user.notebooks.get(req.params.notebookID);
    if (!currentNotebook) return res.status(404).json({ error: "Notebook not found." });

    res.render("Notebook", { userInfo: user, currentNotebook: currentNotebook });
});

router.delete('/:notebookID', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    let notebookID = req.params.notebookID;
    
    if (user.notebooks.has(notebookID)) {
        user.notebooks.delete(notebookID);
        await user.save();
        return res.json({ success: true, message: "Notebook deleted" });
    } else {
        return res.status(404).json({ success: false, message: "Notebook not found" });
    }
}); 

module.exports = router;