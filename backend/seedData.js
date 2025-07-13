const mongoose = require("mongoose");
const Course = require("./models/Course");
const Achievement = require("./models/Achievement");
const User = require("./models/User");

const seedCourses = [
  {
    title: "Introduction to AI",
    description:
      "Learn the basics of artificial intelligence in fun, interactive lessons",
    category: "AI Basics",
    level: "Beginner",
    duration: "2 hours",
    lessons: 5,
    enrolled: 1250,
    rating: 4.8,
    thumbnail: "🤖",
    color: "from-blue-400 to-blue-600",
    skills: ["AI Concepts", "Problem Solving", "Critical Thinking"],
    status: "Published",
  },
  {
    title: "AI in Everyday Life",
    description:
      "Discover how AI works in apps, games, and devices you use daily",
    category: "AI Basics",
    level: "Beginner",
    duration: "1.5 hours",
    lessons: 5,
    enrolled: 980,
    rating: 4.9,
    thumbnail: "📱",
    color: "from-green-400 to-green-600",
    skills: ["Real-world AI", "Technology Awareness"],
    status: "Published",
  },
  {
    title: "How Robots Think",
    description:
      "Explore how robots make decisions and learn from their environment",
    category: "Robotics",
    level: "Beginner",
    duration: "2.5 hours",
    lessons: 5,
    enrolled: 756,
    rating: 4.7,
    thumbnail: "🤖",
    color: "from-purple-400 to-purple-600",
    skills: ["Robot Logic", "Sensors", "Decision Making"],
    status: "Published",
  },
  {
    title: "Machine Learning for Kids",
    description: "Understand how computers learn and get smarter over time",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "3 hours",
    lessons: 5,
    enrolled: 642,
    rating: 4.6,
    thumbnail: "🧠",
    color: "from-indigo-400 to-indigo-600",
    skills: ["Pattern Recognition", "Data Analysis", "Algorithms"],
    status: "Published",
  },
  {
    title: "Creative AI Art",
    description:
      "Create amazing art and music with the help of artificial intelligence",
    category: "AI Basics",
    level: "Beginner",
    duration: "2 hours",
    lessons: 5,
    enrolled: 892,
    rating: 4.9,
    thumbnail: "🎨",
    color: "from-pink-400 to-pink-600",
    skills: ["Creativity", "AI Tools", "Digital Art"],
    status: "Published",
  },
  {
    title: "Coding Your First AI",
    description: "Build simple AI programs using kid-friendly coding tools",
    category: "Coding",
    level: "Intermediate",
    duration: "4 hours",
    lessons: 5,
    enrolled: 523,
    rating: 4.8,
    thumbnail: "💻",
    color: "from-orange-400 to-orange-600",
    skills: ["Programming", "Logic", "Problem Solving"],
    status: "Published",
  },
  {
    title: "AI Ethics & Responsibility",
    description: "Learn about using AI safely and responsibly in our world",
    category: "Ethics",
    level: "Intermediate",
    duration: "1.5 hours",
    lessons: 5,
    enrolled: 445,
    rating: 4.7,
    thumbnail: "⚖️",
    color: "from-teal-400 to-teal-600",
    skills: ["Ethics", "Responsibility", "Critical Thinking"],
    status: "Published",
  },
  {
    title: "Future of AI",
    description:
      "Explore what AI might look like in the future and its possibilities",
    category: "AI Basics",
    level: "Advanced",
    duration: "2.5 hours",
    lessons: 5,
    enrolled: 334,
    rating: 4.8,
    thumbnail: "🚀",
    color: "from-cyan-400 to-cyan-600",
    skills: ["Future Thinking", "Innovation", "Technology Trends"],
    status: "Published",
  },
  {
    title: "Drawing Fundamentals",
    description: "Learn the basics of drawing shapes, forms, and perspectives",
    category: "Art & Design",
    level: "Beginner",
    duration: "3 hours",
    lessons: 5,
    enrolled: 1200,
    rating: 4.7,
    thumbnail: "✏️",
    color: "from-red-400 to-red-600",
    skills: ["Drawing", "Perspective", "Creativity"],
    status: "Published",
  },
];

const seedAchievements = [
  {
    title: "First Lesson",
    description: "Completed your first lesson",
    icon: "🎯",
    category: "learning",
    requirements: {
      lessonsCompleted: 1,
    },
    points: 10,
  },
  {
    title: "Quiz Master",
    description: "Scored 100% on a quiz",
    icon: "🧠",
    category: "skill",
    requirements: {
      perfectScores: 1,
    },
    points: 25,
  },
  {
    title: "AI Explorer",
    description: "Completed all beginner lessons",
    icon: "🤖",
    category: "completion",
    requirements: {
      coursesCompleted: 1,
    },
    points: 50,
  },
  {
    title: "Learning Streak",
    description: "Learned for 7 days in a row",
    icon: "🔥",
    category: "special",
    requirements: {
      streakDays: 7,
    },
    points: 100,
  },
  {
    title: "Course Champion",
    description: "Completed 5 courses",
    icon: "🏆",
    category: "completion",
    requirements: {
      coursesCompleted: 5,
    },
    points: 200,
  },
];

const seedUsers = [
  {
    name: "Emma Johnson",
    email: "emma@email.com",
    password: "password123",
    role: "student",
    age: 8,
    level: "Beginner",
    progress: 75,
  },
  {
    name: "Alex Smith",
    email: "alex@email.com",
    password: "password123",
    role: "student",
    age: 10,
    level: "Intermediate",
    progress: 60,
  },
  {
    name: "Admin User",
    email: "admin@email.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Parent User",
    email: "parent@email.com",
    password: "password123",
    role: "parent",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Course.deleteMany({});
    await Achievement.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️ Cleared existing data");

    // Seed courses
    const courses = await Course.insertMany(seedCourses);
    console.log(`📚 Seeded ${courses.length} courses`);

    // Seed achievements
    const achievements = await Achievement.insertMany(seedAchievements);
    console.log(`🏆 Seeded ${achievements.length} achievements`);

    // Seed users
    const users = await User.insertMany(seedUsers);
    console.log(`👥 Seeded ${users.length} users`);

    console.log("✅ Database seeding completed successfully!");

    return {
      courses: courses.length,
      achievements: achievements.length,
      users: users.length,
    };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor";

  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log("✅ Connected to MongoDB");
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
}

module.exports = { seedDatabase, seedCourses, seedAchievements, seedUsers };
