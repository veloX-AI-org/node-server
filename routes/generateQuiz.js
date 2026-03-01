const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.post('/generateQuiz', async(req, res) => {
  const response = await axios.post(
    `${process.env.PYTHON_SERVER_END_POINT || 'http://localhost:5000'}/generateQuiz`,
    {
      'youtubeURLLink' : req.body.youtubeURLLink
    }
  );

  const data = response.data;
  res.status(200).json({ data });
});

module.exports = router;