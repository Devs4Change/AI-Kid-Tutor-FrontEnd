const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Middleware to check admin (example, adjust as needed)
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admins only" });
}

// Get all courses
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = { status: "Published" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (level && level !== "All") {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new course (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      lessons,
      thumbnail,
      color,
      skills,
      status,
    } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      duration,
      lessons,
      thumbnail,
      color,
      skills,
      status,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a course (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      lessons,
      thumbnail,
      color,
      skills,
      status,
    } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        level,
        duration,
        lessons,
        thumbnail,
        color,
        skills,
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a course (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get course categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Course.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get course statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ status: "Published" });
    const totalEnrolled = await Course.aggregate([
      { $match: { status: "Published" } },
      { $group: { _id: null, total: { $sum: "$enrolled" } } },
    ]);

    const coursesByLevel = await Course.aggregate([
      { $match: { status: "Published" } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
    ]);

    const coursesByCategory = await Course.aggregate([
      { $match: { status: "Published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      totalCourses,
      totalEnrolled: totalEnrolled[0]?.total || 0,
      coursesByLevel,
      coursesByCategory,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
