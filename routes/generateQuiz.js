const express = require('express');
const router = express.Router();


const quizzes = [
  {
    question: "Which planet in our solar system is known as the Red Planet because of its iron-rich surface and dusty appearance?",
    options: [
      "A. Venus, a planet with extreme heat and thick clouds",
      "B. Mars, a rocky planet with a reddish surface",
      "C. Jupiter, a massive gas giant with strong storms",
      "D. Saturn, a gas planet famous for its ring system"
    ],
    answer: 1,
    explanation: "Mars appears red due to iron oxide (rust) on its surface, which reflects reddish light."
  },
  {
    question: "What natural source provides the energy that drives Earth's climate, weather patterns, and supports almost all life?",
    options: [
      "A. The Moon, which mainly affects ocean tides",
      "B. Earth’s core, producing internal geothermal heat",
      "C. The Sun, supplying light and thermal energy",
      "D. Ocean currents, redistributing heat globally"
    ],
    answer: 2,
    explanation: "The Sun is the primary energy source for photosynthesis, weather systems, and life on Earth."
  },
  {
    question: "Which organ in the human body is responsible for pumping oxygen-rich and oxygen-poor blood through the circulatory system?",
    options: [
      "A. Brain, coordinating thoughts and movements",
      "B. Lungs, exchanging oxygen and carbon dioxide",
      "C. Liver, filtering toxins from the blood",
      "D. Heart, acting as a muscular blood pump"
    ],
    answer: 3,
    explanation: "The heart contracts rhythmically to circulate blood throughout the body."
  },
  {
    question: "Which gas do green plants absorb from the atmosphere in order to produce food during photosynthesis?",
    options: [
      "A. Oxygen, which plants release as a byproduct",
      "B. Nitrogen, the most abundant atmospheric gas",
      "C. Carbon dioxide, used to make glucose",
      "D. Hydrogen, found combined with oxygen in water"
    ],
    answer: 2,
    explanation: "Carbon dioxide is absorbed by plants and converted into sugars during photosynthesis."
  },
  {
    question: "Which continent is the largest on Earth in terms of land area and also has the highest population?",
    options: [
      "A. Africa, known for vast deserts and savannas",
      "B. Europe, a small continent with many countries",
      "C. North America, featuring diverse geography",
      "D. Asia, the largest and most populous continent"
    ],
    answer: 3,
    explanation: "Asia covers the greatest land area and is home to more than half of the world's population."
  }
]

router.post('/generateQuiz', (req, res) => {
    res.status(200).json({ success: true, message: quizzes});
});

module.exports = router;