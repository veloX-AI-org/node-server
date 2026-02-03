const express = require('express');
const userModel = require('../models/user');
const axios = require('axios');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

const generateUUID = () => { return crypto.randomUUID() };

const getHomeURL = (url) => {
    return url.split("/")[2];
};

router.post('/upload', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    try {
        const id = generateUUID();

        // POST INDEX & URL to python server
        const axiosResponse = await axios.post(
            'http://127.0.0.1:5000/upsert_url_info',
            {
                indexID: user._id,
                docID: id,
                url: req.body.url
            }
        );

        const urlInfo = {
            urlID: id,
            url: req.body.url,
            homeUrl: getHomeURL(req.body.url),
            date: new Date(),
        };

        // push url
        const notebook = user.notebooks.get(req.body.notebookID);
        notebook.source.urls.push(urlInfo);
        
        // increment counter
        notebook.totalSources = (notebook.totalSources || 0) + 1;

        // mark modified
        user.markModified(`notebooks`);
        await user.save();

        const allURLs = await notebook.source.urls;

        console.log(axiosResponse.data);
        res.status(200).json({ message: allURLs });
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

router.post('/delete', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    try {
        // POST INDEX & URL to python server
        const axiosResponse = await axios.post(
            'http://127.0.0.1:5000/delete_url_info',
            {
                urlID: req.body.urlID,
                indexID: user._id
            }
        );

        // get the notebook
        const notebook = user.notebooks.get(req.body.notebookID);

        notebook.source.urls = notebook.source.urls.filter(
            url => url.urlID !== req.body.urlID // keep everything except the one to delete
        );

        notebook.totalSources = Math.max((notebook.totalSources || 1) - 1, 0);

        user.markModified(`notebooks`);
        await user.save();

        const allURLs = await notebook.source.urls;
        res.status(200).json({ message: allURLs });
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