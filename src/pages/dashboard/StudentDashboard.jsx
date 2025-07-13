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
  CheckCircle,
} from "lucide-react";
import { getCourses } from "../../services/courses";
import { getAchievements } from "../../services/achievements";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalStars: 0,
    currentStreak: 0,
    timeSpent: "0 min",
    completedCourses: 0,
  });

  // Get user info from localStorage
  const getUserInfo = () => {
    const userName = localStorage.getItem("userName") || "Student";
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const userRole = localStorage.getItem("role") || "student";

    // Extract first name from email if no userName is set
    const displayName =
      userName !== "Student" ? userName : userEmail.split("@")[0];

    return {
      name: displayName,
      email: userEmail,
      role: userRole,
      avatar: "👤", // Default avatar
    };
  };

  // Calculate stats from localStorage data
  const calculateStats = (coursesData) => {
    const currentUserEmail = localStorage.getItem("userEmail") || "anonymous";
    let totalLessonsCompleted = 0;
    let totalStars = 0;
    let completedCourses = 0;

    coursesData.forEach((course) => {
      const completedLessonsKey = `completedLessons_${course._id}_${currentUserEmail}`;
      const completedLessons = JSON.parse(
        localStorage.getItem(completedLessonsKey) || "[]"
      );
      const courseCompletedLessons = completedLessons.length;
      totalLessonsCompleted += courseCompletedLessons;

      // Calculate stars based on completion (1 star per 25% completion)
      const totalLessons = course.lessons || 5;
      const completionPercentage =
        totalLessons > 0 ? (courseCompletedLessons / totalLessons) * 100 : 0;
      const courseStars = Math.floor(completionPercentage / 25);
      totalStars += courseStars;

      if (courseCompletedLessons === totalLessons && totalLessons > 0) {
        completedCourses++;
      }
    });

    // Calculate streak (simplified - could be enhanced with actual date tracking)
    const currentStreak = Math.min(7, Math.floor(totalLessonsCompleted / 2));

    // Calculate time spent (estimate: 20 minutes per lesson)
    const totalMinutes = totalLessonsCompleted * 20;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeSpent =
      hours > 0 ? `${hours}.${Math.floor(minutes / 10)} hrs` : `${minutes} min`;

    return {
      lessonsCompleted: totalLessonsCompleted,
      totalStars,
      currentStreak,
      timeSpent,
      completedCourses,
    };
  };

  // Get recent activity from localStorage
  const getRecentActivity = () => {
    const userActivity = JSON.parse(
      localStorage.getItem("userActivity") || "[]"
    );
    const currentUserEmail = localStorage.getItem("userEmail") || "anonymous";

    // Filter activities for current user and get last 3
    const userActivities = userActivity
      .filter((activity) => activity.userEmail === currentUserEmail)
      .slice(0, 3);

    return userActivities.map((activity) => {
      const timeAgo = getTimeAgo(activity.timestamp);

      if (activity.action === "lesson_completed") {
        return {
          icon: <CheckCircle size={16} className="text-green-600" />,
          bgColor: "bg-green-100",
          title: `Completed "${activity.lessonTitle}"`,
          time: timeAgo,
        };
      } else if (activity.action === "login") {
        return {
          icon: <TrendingUp size={16} className="text-blue-600" />,
          bgColor: "bg-blue-100",
          title: "Logged in",
          time: timeAgo,
        };
      }

      return {
        icon: <Award size={16} className="text-yellow-600" />,
        bgColor: "bg-yellow-100",
        title: "Activity recorded",
        time: timeAgo,
      };
    });
  };

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, achievementsData] = await Promise.all([
          getCourses(),
          getAchievements(),
        ]);

        // Calculate real stats from localStorage
        const calculatedStats = calculateStats(coursesData);

        // Add frontend-specific fields to backend data with real completion status
        const currentUserEmail =
          localStorage.getItem("userEmail") || "anonymous";
        const coursesWithFrontendFields = coursesData.map((course) => {
          const completedLessonsKey = `completedLessons_${course._id}_${currentUserEmail}`;
          const completedLessons = JSON.parse(
            localStorage.getItem(completedLessonsKey) || "[]"
          );
          const totalLessons = course.lessons || 5;
          const completedLessonsCount = completedLessons.length;
          const progress =
            totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
          const completed =
            completedLessonsCount === totalLessons && totalLessons > 0;

          // Calculate stars based on completion
          const stars = Math.floor(progress / 25);

          return {
            ...course,
            id: course._id,
            completed,
            progress,
            stars,
          };
        });

        // Mark achievements as earned based on stats
        const achievementsWithFrontendFields = achievementsData.map(
          (achievement) => {
            let earned = false;
            if (
              achievement.title === "First Lesson" &&
              calculatedStats.lessonsCompleted >= 1
            ) {
              earned = true;
            } else if (
              achievement.title === "AI Explorer" &&
              calculatedStats.completedCourses >= 1
            ) {
              earned = true;
            } else if (
              achievement.title === "Course Champion" &&
              calculatedStats.completedCourses >= 5
            ) {
              earned = true;
            }
            // Quiz Master and Learning Streak require additional tracking
            return {
              ...achievement,
              earned,
            };
          }
        );

        setCourses(coursesWithFrontendFields);
        setAchievements(achievementsWithFrontendFields);
        setStats(calculatedStats);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ensure stats object is properly initialized
  const safeStats = {
    lessonsCompleted: stats.lessonsCompleted || 0,
    completedCourses: stats.completedCourses || 0,
    totalStars: stats.totalStars || 0,
    timeSpent: stats.timeSpent || "0 min",
  };

  const statsCards = [
    {
      label: "Lessons Completed",
      value: safeStats.lessonsCompleted + "",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      label: "Completed Courses",
      value: safeStats.completedCourses + "",
      icon: Trophy,
      color: "bg-green-500",
    },
    {
      label: "Total Stars",
      value: safeStats.totalStars + "",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "Time Spent",
      value: safeStats.timeSpent,
      icon: Clock,
      color: "bg-purple-500",
    },
  ];

  const userInfo = getUserInfo();
  const recentActivity = getRecentActivity();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {userInfo.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Ready to continue your AI learning journey?
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <card.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <BookOpen className="text-blue-600 mr-2" size={24} />
                Current Courses
              </h2>
              {courses.filter((course) => !course.completed).length > 0 ? (
                <div className="space-y-4">
                  {courses
                    .filter((course) => !course.completed)
                    .slice(0, 4)
                    .map((course) => (
                      <div
                        key={course.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          course.completed
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                course.completed
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              } text-white`}
                            >
                              {course.completed ? (
                                <Trophy size={16} />
                              ) : (
                                <Play size={16} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                {course.title || "Untitled Course"}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{course.duration || "2 hours"}</span>
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (course.level || "Beginner") === "Beginner"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {course.level || "Beginner"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {Math.round(course.progress || 0)}% complete
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < course.stars
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {courses
                    .filter((course) => !course.completed)
                    .slice(0, 4)
                    .map((course) => (
                      <div
                        key={course.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          course.completed
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                course.completed
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              } text-white`}
                            >
                              {course.completed ? (
                                <Trophy size={16} />
                              ) : (
                                <Play size={16} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                {course.title || "Untitled Course"}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{course.duration || "2 hours"}</span>
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    (course.level || "Beginner") === "Beginner"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {course.level || "Beginner"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {Math.round(course.progress || 0)}% complete
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Content */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Achievements
              </h2>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Loading achievements...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.slice(0, 5).map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        achievement.earned
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.earned
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        <span className="text-lg">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium text-sm ${
                            achievement.earned
                              ? "text-yellow-800"
                              : "text-gray-600"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-xs ${
                            achievement.earned
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <div className="flex items-center space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${activity.bgColor}`}
                    >
                      {activity.icon}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        {courses.filter((course) => course.completed).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <Trophy className="text-green-600 mr-2" size={24} />
              Completed Courses
            </h2>
            <div className="space-y-4">
              {courses
                .filter((course) => course.completed)
                .map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg border-2 border-green-200 bg-green-50 cursor-pointer transition-all duration-200 hover:border-green-300"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-500 text-white">
                          <Trophy size={16} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {course.title || "Untitled Course"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{course.duration || "2 hours"}</span>
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {course.level || "Beginner"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(course.progress || 0)}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
