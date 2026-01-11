const express = require('express');
const router = express.Router();


const quizzes = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["A. Venus", "B. Mars", "C. Jupiter", "D. Saturn"],
    answer: 1,
    explanation: "Mars is called the Red Planet because its surface contains iron oxide, which gives it a reddish appearance."
  },
  {
    question: "What is the name of the galaxy that contains our solar system?",
    options: ["A. Andromeda", "B. Whirlpool", "C. Milky Way", "D. Sombrero"],
    answer: 2,
    explanation: "Our solar system is located in the Milky Way galaxy."
  },
  {
    question: "Which celestial body is at the center of our solar system?",
    options: ["A. Earth", "B. The Moon", "C. Jupiter", "D. The Sun"],
    answer: 3,
    explanation: "The Sun is at the center of the solar system and its gravity holds the planets in orbit."
  },
  {
    question: "What force keeps planets in orbit around the Sun?",
    options: ["A. Magnetism", "B. Nuclear force", "C. Gravity", "D. Friction"],
    answer: 2,
    explanation: "Gravity is the force that attracts planets to the Sun and keeps them in their orbits."
  },
  {
    question: "Which planet has the most visible rings?",
    options: ["A. Saturn", "B. Uranus", "C. Neptune", "D. Jupiter"],
    answer: 0,
    explanation: "Saturn is famous for its large, bright, and easily visible ring system."
  },
]

router.post('/generateQuiz', (req, res) => {
    res.status(200).json({ success: true, message: quizzes});
});

module.exports = router;