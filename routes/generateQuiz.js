const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generateQuiz', async(req, res) => {
  const response = await axios.post(
    'http://127.0.0.1:5000/generateQuiz',
    {
      'youtubeURLLink' : req.body.youtubeURLLink
    }
  );

  const data = response.data;
  res.status(200).json({ data });
});

module.exports = router;