const express = require('express');
const upload = require('../models/multer');
const getDocumets = require('../public/javascript/getDocument');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');
const axios = require('axios');
const router = express.Router();

const generateUUID = () => { return crypto.randomUUID() };

router.post('/upload', isLoggedIn, upload.single("file"), async(req, res) => {
    console.log("Called");
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const id = generateUUID();

    const arrayOfDocuments = await getDocumets(req.file.path);
    
    // Send Docs to Python Server
    try {
        const axiosResponse = await axios.post(
            'http://127.0.0.1:5000/upsert_documents',
            {
                docs: arrayOfDocuments,
                docID: id,
                indexID: user._id
            }
        )

        console.log(axiosResponse.data);
    } catch (error) {
        // Axios-specific handling
        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", error.response.data);
        } else if (error.request) {
            // Request sent but no response
            console.error("No response from server:", error.message);
        } else {
            // Something else happened
            console.error("Axios error:", error.message);
        }
    };

    const file = {
        fileID: id,
        filename: req.file.originalname,
        filesize: (Number(req.file.size) / (1024*1024)),
        date: new Date(),
    };

    // push document
    const notebook = user.notebooks.get(req.body.notebookID);
    notebook.source.documents.push(file);

    // increment counter
    notebook.totalSources = (notebook.totalSources || 0) + 1;

    // mark modified
    user.markModified(`notebooks`);
    await user.save();

    res.status(200).json({ message: "File Recieved"});
});

// {    
//   fieldname: 'file',
//   originalname: 'pooja mam project.pdf',
//   encoding: '7bit',
//   mimetype: 'application/pdf',
//   destination: 'C:\\Users\\Lenovo\\AppData\\Local\\Temp',
//   filename: '3d0b9e0f2a5827597fc2507d1698cb9f',
//   path: 'C:\\Users\\Lenovo\\AppData\\Local\\Temp\\3d0b9e0f2a5827597fc2507d1698cb9f',
//   size: 164076
// }

module.exports = router;