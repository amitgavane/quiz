const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// import routes
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const attemptRoutes = require("./routes/attempt"); // NEW

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.get("/", (req, res) => res.send("Quiz Backend Running"));

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/attempt", attemptRoutes); // NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
