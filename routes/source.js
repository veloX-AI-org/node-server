const express = require('express');
const upload = require('../models/multer');
const getDocumets = require('../public/javascript/getDocument');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');
const axios = require('axios');
const router = express.Router();

const generateUUID = () => { return crypto.randomUUID() };

router.post('/upload', isLoggedIn, upload.single("file"), async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Send Docs to Python Server
    try {
        const id = generateUUID();
        const arrayOfDocuments = await getDocumets(req.file.path);

        const axiosResponse = await axios.post(
            'http://127.0.0.1:5000/upsert_documents',
            {
                docs: arrayOfDocuments,
                docID: id,
                indexID: user._id
            }
        )

        const file = {
            fileID: id,
            filename: req.file.originalname,
            filesize: (Number(req.file.size) / (1024*1024)),
            date: new Date(),
        };

        const notebook = user.notebooks.get(req.body.notebookID);

        if (axiosResponse.data.message == 'Data Upserted Successfully!') {
            // push document
            notebook.source.documents.push(file);
            
            // increment counter
            notebook.totalSources = (notebook.totalSources || 0) + 1;
            
            // mark modified
            user.markModified(`notebooks`);
            await user.save();

            // Get Summary and questions
            if ((notebook.totalSources==1 || notebook.totalSources%3 == 0) && notebook.totalSources <=18) {
                let allurlsID = notebook.source.urls.map(urls => urls.urlID);
                let alldocsID = notebook.source.documents.map(docs => docs.fileID);
                
                const getSummaryDataResponse = await axios.post(
                    'http://127.0.0.1:5000/getSummary',
                    {
                        indexID: user._id,
                        allurlsID: allurlsID,
                        alldocsID: alldocsID
                    }
                );
            
                try {
                    notebook.summary.summary = getSummaryDataResponse.data.summary;
                    notebook.summary.questions = getSummaryDataResponse.data.questions;
            
                    await user.save();
                } catch {
                    console.log("Failed to save data of summary.");
                };
                
                const allDocs = await notebook.source.documents;
                res.status(200).json({ 
                    alldocs: allDocs,
                    axiosResponse: axiosResponse.data.message,
                    summary: getSummaryDataResponse.data,
                    totalSources: notebook.totalSources
                });
                return;
            };
        };

        const allDocs = await notebook.source.documents;
        res.status(200).json({ alldocs: allDocs, axiosResponse: axiosResponse.data.message });
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
});

router.post('/delete', isLoggedIn, upload.single("file"), async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Send Docs to Python Server
    try {
        const axiosResponse = await axios.post(
            'http://127.0.0.1:5000/delete_documents',
            {
                docID: req.body.fileID,
                indexID: user._id
            }
        )

        // get the notebook
        const notebook = user.notebooks.get(req.body.notebookID);

        notebook.source.documents = notebook.source.documents.filter(
            doc => doc.fileID !== req.body.fileID // keep everything except the one to delete
        );

        notebook.totalSources = Math.max((notebook.totalSources || 1) - 1, 0);

        user.markModified(`notebooks`);
        await user.save();

        const allDocs = await notebook.source.documents;
        res.status(200).json({ message: allDocs });
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
});

module.exports = router;