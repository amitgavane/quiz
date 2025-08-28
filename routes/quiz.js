// routes/quiz.js
const express = require("express");
const Quiz = require("../models/quiz");
const auth = require("../middleware/auth");
const router = express.Router();

// Create Quiz (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { question, options, answer } = req.body;
    if (!question || !options || !answer) {
      return res.status(400).json({ error: "question, options and answer are required" });
    }

    const quiz = new Quiz({ question, options, answer });
    await quiz.save();
    res.json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all quizzes (public)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quiz by id (public)
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
