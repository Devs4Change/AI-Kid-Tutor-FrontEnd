import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChild, setActiveChild] = useState("Emma");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const children = [
    { name: "Emma", age: 8, level: "Beginner", progress: 75, avatar: "👧" },
    {
      name: "Alex",
      age: 10,
      level: "Intermediate",
      progress: 60,
      avatar: "👦",
    },
  ];

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
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/courses");
        if (response.ok) {
          const backendCourses = await response.json();

          // Get user's completion data
          const currentUserEmail =
            localStorage.getItem("userEmail") || "anonymous";

          // Add completion status to each course
          const coursesWithCompletion = backendCourses.map((course) => {
            const completedLessonsKey = `completedLessons_${course._id}_${currentUserEmail}`;
            const completedLessons = JSON.parse(
              localStorage.getItem(completedLessonsKey) || "[]"
            );
            const totalLessons = course.lessons ? course.lessons.length : 5;
            const progress =
              totalLessons > 0
                ? Math.round((completedLessons.length / totalLessons) * 100)
                : 0;
            const completed =
              completedLessons.length === totalLessons && totalLessons > 0;

            return {
              ...course,
              id: course._id,
              progress,
              completed,
              unlocked: true,
              // Add default values for missing fields
              duration: course.duration || "2 hours",
              enrolled: course.enrolled || 500,
              rating: course.rating || 4.5,
              skills: course.skills || ["Learning", "Problem Solving"],
              color: course.color || "from-blue-400 to-blue-600",
              thumbnail: course.thumbnail || "📚",
            };
          });

          setCourses(coursesWithCompletion);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Calculate stats from real data
  const completedCourses = courses.filter((course) => course.completed).length;
  const inProgressCourses = courses.filter(
    (course) => course.progress > 0 && !course.completed
  ).length;
  const totalCourses = courses.length;

  const child = children.find((c) => c.name === activeChild);

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
            <div className="flex items-center space-x-4">
              <select
                value={activeChild}
                onChange={(e) => setActiveChild(e.target.value)}
                className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-blue-800 font-medium"
              >
                {children.map((child) => (
                  <option key={child.name} value={child.name}>
                    {child.name}
                  </option>
                ))}
              </select>
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
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
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">
                    {course.description}
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
                          {course.lessons ? course.lessons.length : 5} lessons
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={14}
                      />
                      <span className="text-sm font-medium">
                        {course.rating}
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
                      {course.level}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Users size={14} />
                      <span>{course.enrolled.toLocaleString()}</span>
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      You'll learn:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar (if started) */}
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                      course.completed
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : course.progress > 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {course.completed ? (
                      <>
                        <Trophy size={16} />
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
                      </>
                    )}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
