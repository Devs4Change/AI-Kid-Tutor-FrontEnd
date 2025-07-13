const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");

// Middleware to check admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admins only" });
}

// Get all achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(achievements);
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single achievement
router.get("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement)
      return res.status(404).json({ message: "Achievement not found" });
    res.json(achievement);
  } catch (error) {
    console.error("Get achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new achievement (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, description, icon, category, requirements, points } =
      req.body;

    const achievement = new Achievement({
      title,
      description,
      icon,
      category,
      requirements,
      points,
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    console.error("Create achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an achievement (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      category,
      requirements,
      points,
      isActive,
    } = req.body;

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        icon,
        category,
        requirements,
        points,
        isActive,
      },
      { new: true }
    );

    if (!achievement)
      return res.status(404).json({ message: "Achievement not found" });
    res.json(achievement);
  } catch (error) {
    console.error("Update achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an achievement (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement)
      return res.status(404).json({ message: "Achievement not found" });
    res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Delete achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get achievements by category
router.get("/category/:category", async (req, res) => {
  try {
    const achievements = await Achievement.find({
      category: req.params.category,
      isActive: true,
    }).sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    console.error("Get achievements by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
