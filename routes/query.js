const express = require('express');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');
const axios = require('axios');
const router = express.Router();

async function getMarkdown(markdown) {
    const { marked } = await import('marked');
    const hljs = await import('highlight.js');

    // Configure marked with highlight.js
    marked.setOptions({
        highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
        }
    });

    const html = marked.parse(markdown);
    return html;
};

router.post('/', isLoggedIn, async(req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const notebook = user.notebooks.get(req.body.notebookID);

    try {
        const axiosResponse = await axios.post(
            'https://veloxai-python.onrender.com/getAIResponse',
            {
                query: req.body.query,
                pastConverstation: notebook.chatHistory,
                userID: req.user._id,
                notebookID: req.body.notebookID
            }
        );

        let markdownRes = axiosResponse.data;
        
        getMarkdown(markdownRes.response).then(async (html) => {
            notebook.chatHistory.push({
                role: "User",
                content: req.body.query
            });

            notebook.chatHistory.push({
                role: "Chatbot",
                content: html
            });

            user.markModified("notebooks");
            await user.save();

            res.status(200).json({ 
                data: html
            });
        });

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