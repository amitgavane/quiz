// routes/attempt.js
const express = require("express");
const Attempt = require("../models/attempt");
const Quiz = require("../models/quiz");
const auth = require("../middleware/auth");
const router = express.Router();

/**
 * Submit an attempt for a quiz
 * POST /attempt
 * Body: { quizId: "<quizId>", selectedOption: "<option string>" }
 * Requires Authorization header: "Bearer <token>"
 */
router.post("/", auth, async (req, res) => {
  try {
    const { quizId, selectedOption } = req.body;
    if (!quizId || selectedOption === undefined) {
      return res.status(400).json({ error: "quizId and selectedOption are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // score: 1 if correct, 0 otherwise (you can change to scoring rules you want)
    const score = quiz.answer === selectedOption ? 1 : 0;

    const attempt = new Attempt({
      userId: req.user.id,
      quizId: quiz._id,
      score
    });

    await attempt.save();

    res.json({
      message: "Attempt recorded",
      attempt: {
        id: attempt._id,
        quizId: attempt.quizId,
        userId: attempt.userId,
        score: attempt.score
      },
      correctAnswer: quiz.answer, // optional; remove if you don't want to reveal
      yourAnswer: selectedOption
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all attempts of the authenticated user
 * GET /attempt/my
 */
router.get("/my", auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .populate("quizId", "question options answer")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * (Optional) Get all attempts for a specific quiz (could be used by admin/creator)
 * GET /attempt/quiz/:quizId
 * Protected
 */
router.get("/quiz/:quizId", auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ quizId: req.params.quizId })
      .populate("userId", "username")
      .populate("quizId", "question")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
