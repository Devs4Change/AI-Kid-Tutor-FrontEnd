import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  BookOpen,
  Star,
  Trophy,
  Clock,
  Play,
  Users,
  TrendingUp,
  Award,
  Filter,
  Search,
  ChevronRight,
  Lock,
  CheckCircle,
} from "lucide-react";
import { getCourses } from "../services/courses";

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { name: "All", icon: "📚", color: "bg-gray-100 text-gray-800" },
    { name: "AI Basics", icon: "🤖", color: "bg-blue-100 text-blue-800" },
    {
      name: "Machine Learning",
      icon: "🧠",
      color: "bg-purple-100 text-purple-800",
    },
    { name: "Robotics", icon: "🦾", color: "bg-green-100 text-green-800" },
    { name: "Coding", icon: "💻", color: "bg-orange-100 text-orange-800" },
    { name: "Ethics", icon: "⚖️", color: "bg-pink-100 text-pink-800" },
    { name: "Art & Design", icon: "🎨", color: "bg-red-100 text-red-800" },
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // Fetch courses from backend and add completion data
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true);
        const backendCourses = await getCourses();

        // Get user's completion data
        const currentUserEmail =
          localStorage.getItem("userEmail") || "anonymous";

        // Add completion status to each course
        const coursesWithCompletion = backendCourses.map((course) => {
          const courseId = String(course.id); // use id from backend
          const completedLessonsKey = `completedLessons_${courseId}_${currentUserEmail}`;
          const completedLessons = JSON.parse(
            localStorage.getItem(completedLessonsKey) || "[]"
          );
          // lessons can be a number or an array
          const totalLessons = Array.isArray(course.lessons)
            ? course.lessons.length
            : typeof course.lessons === "number"
            ? course.lessons
            : 5;
          const progress =
            totalLessons > 0
              ? Math.round((completedLessons.length / totalLessons) * 100)
              : 0;
          const completed =
            completedLessons.length === totalLessons && totalLessons > 0;

          return {
            ...course,
            id: courseId, // always set id to backend id as string
            _id: courseId, // ensure _id is present and string for compatibility
            progress,
            completed,
            unlocked: true,
            // Add default values for missing fields
            duration: course.duration || "2 hours",
            enrolled: course.enrolled || 500,
            rating: course.rating || 4.5,
            skills: course.skills || ["Learning", "Problem Solving"],
            color: course.color || "from-blue-400 to-blue-600",
            thumbnail: course.thumbnail || "\ud83d\udcda",
          };
        });

        setCourses(coursesWithCompletion);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, []);

  // Calculate stats from real data
  const completedCourses = courses.filter((course) => course.completed).length;
  const inProgressCourses = courses.filter(
    (course) => course.progress > 0 && !course.completed
  ).length;
  const totalCourses = courses.length;

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Home
          </button>
        </div>
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Learning Courses
              </h1>
              <p className="text-gray-600">
                Choose your next learning adventure!
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-800">
                    {completedCourses}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">In Progress</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {inProgressCourses}
                  </p>
                </div>
                <BookOpen className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Total Available</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {totalCourses}
                  </p>
                </div>
                <Trophy className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.name
                        ? "bg-blue-500 text-white"
                        : category.color
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {/* Course Header */}
                <div
                  className={`bg-gradient-to-r ${course.color} p-6 text-white relative`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{course.thumbnail}</span>
                    {course.completed && (
                      <div className="bg-white bg-opacity-20 rounded-full p-1">
                        <CheckCircle className="text-white" size={20} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {typeof course.title === "string"
                      ? course.title
                      : JSON.stringify(course.title)}
                  </h3>
                  <p className="text-white text-opacity-90 text-sm">
                    {typeof course.description === "string"
                      ? course.description
                      : JSON.stringify(course.description)}
                  </p>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Course Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BookOpen size={14} />
                        <span>
                          {Array.isArray(course.lessons)
                            ? course.lessons.length
                            : typeof course.lessons === "number"
                            ? course.lessons
                            : typeof course.lessons === "object"
                            ? JSON.stringify(course.lessons)
                            : 5}{" "}
                          lessons
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={14}
                      />
                      <span className="text-sm font-medium">
                        {typeof course.rating === "number"
                          ? course.rating
                          : JSON.stringify(course.rating)}
                      </span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : course.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {typeof course.level === "string"
                        ? course.level
                        : JSON.stringify(course.level)}
                    </span>
                  </div>
                  {/* Start/Continue/Completed Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                      course.completed
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : course.progress > 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (course.completed) {
                        // Optionally show a message or do nothing
                        return;
                      }
                      const token = localStorage.getItem("token");
                      if (!token) {
                        navigate("/login");
                        return;
                      }
                      navigate(`/course/${course.id}`);
                    }}
                  >
                    {course.completed ? (
                      <>
                        <CheckCircle size={16} />
                        <span>Completed</span>
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <Play size={16} />
                        <span>Continue</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Start Course</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                  {/* Add more course details or actions here if needed */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
