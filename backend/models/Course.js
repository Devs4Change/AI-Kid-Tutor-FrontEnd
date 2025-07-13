const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  duration: {
    type: String,
    required: true,
  },
  lessons: {
    type: Number,
    default: 0,
  },
  enrolled: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  thumbnail: {
    type: String,
    default: "📚",
  },
  color: {
    type: String,
    default: "from-blue-400 to-blue-600",
  },
  skills: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["Published", "Draft"],
    default: "Draft",
  },
  isUnlocked: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
