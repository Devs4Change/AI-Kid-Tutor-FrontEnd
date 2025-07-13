const express = require("express");
const router = express.Router();
const CourseRating = require("../models/CourseRating");
const Course = require("../models/Course");

// Submit or update a course rating
router.post("/", async (req, res) => {
  try {
    const { courseId, rating, review = "" } = req.body;
    const userEmail = req.headers["user-email"] || req.body.userEmail;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user has completed the course (simplified check)
    // In a real app, you'd check actual completion status
    const completedLessonsKey = `completedLessons_${courseId}_${userEmail}`;
    const completedLessons = JSON.parse(req.body.completedLessons || "[]");

    if (completedLessons.length < (course.lessons || 5)) {
      return res.status(403).json({
        message: "You must complete the course before rating it",
      });
    }

    // Find existing rating or create new one
    let courseRating = await CourseRating.findOne({
      userEmail,
      courseId,
    });

    if (courseRating) {
      // Update existing rating
      courseRating.rating = rating;
      courseRating.review = review;
      await courseRating.save();
    } else {
      // Create new rating
      courseRating = new CourseRating({
        userEmail,
        courseId,
        rating,
        review,
      });
      await courseRating.save();
    }

    // Calculate and update course average rating
    await updateCourseAverageRating(courseId);

    res.status(200).json({
      message: "Rating submitted successfully",
      rating: courseRating,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get course ratings and average
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = req.headers["user-email"] || req.query.userEmail;

    // Get all ratings for the course
    const ratings = await CourseRating.find({ courseId })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to recent 10 ratings

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // Get user's rating if provided
    let userRating = null;
    if (userEmail) {
      userRating = await CourseRating.findOne({
        userEmail,
        courseId,
      });
    }

    res.status(200).json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length,
      userRating,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's ratings
router.get("/user", async (req, res) => {
  try {
    const userEmail = req.headers["user-email"] || req.query.userEmail;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const userRatings = await CourseRating.find({ userEmail })
      .populate("courseId", "title thumbnail")
      .sort({ updatedAt: -1 });

    res.status(200).json({ ratings: userRatings });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to update course average rating
async function updateCourseAverageRating(courseId) {
  try {
    const ratings = await CourseRating.find({ courseId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    await Course.findByIdAndUpdate(courseId, {
      rating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Error updating course average rating:", error);
  }
}

module.exports = router;
