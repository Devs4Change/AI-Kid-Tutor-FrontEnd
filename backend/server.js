const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const coursesRouter = require("./routes/courses");
const usersRouter = require("./routes/users");
const achievementsRouter = require("./routes/achievements");
const courseRatingsRouter = require("./routes/courseRatings");
const authMiddleware = require("./middleware/auth");
const { seedDatabase } = require("./seedData");

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/ratings", courseRatingsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AI Kid Tutor Backend is running!" });
});

const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor"; // Change as needed

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Seed the database with initial data
    try {
      await seedDatabase();
    } catch (error) {
      console.log(
        "⚠️ Database already seeded or seeding failed:",
        error.message
      );
    }

    app.listen(5000, () =>
      console.log("🚀 Backend server running on port 5000")
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
