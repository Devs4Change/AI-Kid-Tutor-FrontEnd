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
  Settings as SettingsIcon,
  GripVertical,
  X as CloseIcon,
} from "lucide-react";
import { getCourses } from "../../services/courses";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courses, setCourses] = useState([]);
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
        const coursesData = await getCourses();
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
        setCourses(coursesWithFrontendFields);
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
  // Calculate overall progress (all lessons completed / all lessons)
  const totalLessons = courses.reduce(
    (sum, c) =>
      sum +
      (Array.isArray(c.lessons)
        ? c.lessons.length
        : typeof c.lessons === "number"
        ? c.lessons
        : 0),
    0
  );
  const totalCompletedLessons = courses.reduce((sum, c) => {
    const completedLessonsKey = `completedLessons_${c._id}_${
      localStorage.getItem("userEmail") || "anonymous"
    }`;
    const completedLessons = JSON.parse(
      localStorage.getItem(completedLessonsKey) || "[]"
    );
    return sum + completedLessons.length;
  }, 0);
  const overallProgress =
    totalLessons > 0
      ? Math.round((totalCompletedLessons / totalLessons) * 100)
      : 0;

  const userInfo = getUserInfo();
  const recentActivity = getRecentActivity();

  // Badge definitions
  const BADGES = [
    {
      id: "first_lesson",
      name: "First Lesson",
      description: "Completed your first lesson!",
      icon: "🎉",
      criteria: (stats, quizStats) => stats.lessonsCompleted >= 1,
    },
    {
      id: "five_lessons",
      name: "5 Lessons",
      description: "Completed 5 lessons!",
      icon: "🏅",
      criteria: (stats, quizStats) => stats.lessonsCompleted >= 5,
    },
    {
      id: "seven_streak",
      name: "7-Day Streak",
      description: "7 days of learning in a row!",
      icon: "🔥",
      criteria: (stats, quizStats) => stats.currentStreak >= 7,
    },
    {
      id: "first_quiz",
      name: "Quiz Novice",
      description: "Completed your first quiz!",
      icon: "🧠",
      criteria: (stats, quizStats) => quizStats.quizzesCompleted >= 1,
    },
    {
      id: "three_quizzes",
      name: "Quiz Master",
      description: "Completed 3 quizzes!",
      icon: "👑",
      criteria: (stats, quizStats) => quizStats.quizzesCompleted >= 3,
    },
  ];

  // Helper to get quiz stats from localStorage
  const getQuizStats = () => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const key = `quizStats_${userEmail}`;
    return JSON.parse(localStorage.getItem(key) || '{"quizzesCompleted":0}');
  };

  // Helper to set quiz stats
  const setQuizStats = (quizStats) => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const key = `quizStats_${userEmail}`;
    localStorage.setItem(key, JSON.stringify(quizStats));
  };

  // Award badges and store in localStorage
  const getEarnedBadges = (stats, quizStats) => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const key = `earnedBadges_${userEmail}`;
    let earned = JSON.parse(localStorage.getItem(key) || "[]");
    let updated = false;
    BADGES.forEach((badge) => {
      if (badge.criteria(stats, quizStats) && !earned.includes(badge.id)) {
        earned.push(badge.id);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(key, JSON.stringify(earned));
    }
    return earned;
  };

  const [quizStats, setQuizStatsState] = useState(getQuizStats());
  const [earnedBadges, setEarnedBadges] = useState([]);

  // Update badges when stats or quizStats change
  useEffect(() => {
    const earned = getEarnedBadges(stats, quizStats);
    setEarnedBadges(earned);
  }, [stats, quizStats]);

  // Listen for quiz completion events (simulate for demo)
  useEffect(() => {
    // Listen for a custom event 'quizCompleted' to increment quiz count
    const handler = () => {
      const newStats = {
        ...quizStats,
        quizzesCompleted: (quizStats.quizzesCompleted || 0) + 1,
      };
      setQuizStats(newStats);
      setQuizStatsState(newStats);
    };
    window.addEventListener("quizCompleted", handler);
    return () => window.removeEventListener("quizCompleted", handler);
  }, [quizStats]);

  // Widget definitions
  const DASHBOARD_WIDGETS = [
    { id: "badges", label: "Badges" },
    { id: "recentActivity", label: "Recent Activity" },
    { id: "currentCourses", label: "Current Courses" },
    { id: "recommendedCourses", label: "Recommended Courses" },
    { id: "completedCourses", label: "Completed Courses" },
  ];

  const getWidgetPrefs = () => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const key = `dashboardWidgets_${userEmail}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    // Default: all widgets, default order
    return DASHBOARD_WIDGETS.map((w) => ({ id: w.id, visible: true }));
  };

  const setWidgetPrefs = (prefs) => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const key = `dashboardWidgets_${userEmail}`;
    localStorage.setItem(key, JSON.stringify(prefs));
  };

  const [widgetPrefs, setWidgetPrefsState] = useState(getWidgetPrefs());
  const [showCustomize, setShowCustomize] = useState(false);

  // Save widgetPrefs to localStorage when changed
  useEffect(() => {
    setWidgetPrefs(widgetPrefs);
  }, [widgetPrefs]);

  // Drag-and-drop handlers
  const handleDragStart = (e, idx) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("widgetIdx", idx);
  };
  const handleDrop = (e, idx) => {
    const fromIdx = parseInt(e.dataTransfer.getData("widgetIdx"), 10);
    if (fromIdx === idx) return;
    const newPrefs = [...widgetPrefs];
    const [moved] = newPrefs.splice(fromIdx, 1);
    newPrefs.splice(idx, 0, moved);
    setWidgetPrefsState(newPrefs);
  };
  const handleDragOver = (e) => e.preventDefault();

  // Widget toggle
  const toggleWidget = (id) => {
    setWidgetPrefsState((prefs) =>
      prefs.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  // Render widgets based on prefs
  const renderWidget = (id) => {
    switch (id) {
      case "badges":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <Award className="text-yellow-500 mr-2" size={24} />
              Badges
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {BADGES.map((badge) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-200 ${
                      earned
                        ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-900 opacity-60"
                    }`}
                    title={badge.description}
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span
                      className={`font-semibold text-sm ${
                        earned
                          ? "text-yellow-700 dark:text-yellow-200"
                          : "text-gray-400"
                      }`}
                    >
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "recentActivity":
        return (
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
        );
      case "currentCourses":
        return (
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
                              course.completed ? "bg-green-500" : "bg-blue-500"
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
              <div className="text-gray-500 text-center py-8">
                No current courses
              </div>
            )}
          </div>
        );
      case "recommendedCourses":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <Star className="text-yellow-500 mr-2" size={24} />
              Recommended Courses
            </h2>
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses
                .filter(
                  (course) => !course.completed && (course.progress || 0) === 0
                )
                .slice(0, 3)
                .map((course) => (
                  <div
                    key={course.id}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow p-4 flex flex-col justify-between border border-blue-100 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{course.thumbnail || "📚"}</div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {course.level || "Beginner"}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                            {course.category || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold shadow hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Start Course
                    </button>
                  </div>
                ))}
              {courses.filter(
                (course) => !course.completed && (course.progress || 0) === 0
              ).length === 0 && (
                <div className="text-gray-500 text-center col-span-2">
                  No new courses to recommend. Great job!
                </div>
              )}
            </div>
          </div>
        );
      case "completedCourses":
        return (
          courses.filter((course) => course.completed).length > 0 && (
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
          )
        );
      default:
        return null;
    }
  };

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

        {/* Customize Dashboard Button */}
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold shadow"
            onClick={() => setShowCustomize(true)}
          >
            <SettingsIcon size={18} />
            Customize Dashboard
          </button>
        </div>
        {/* Customize Modal */}
        {showCustomize && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setShowCustomize(false)}
                aria-label="Close"
              >
                <CloseIcon size={22} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Customize Dashboard
              </h3>
              <div className="space-y-3">
                {widgetPrefs.map((w, idx) => {
                  const widget = DASHBOARD_WIDGETS.find((dw) => dw.id === w.id);
                  return (
                    <div
                      key={w.id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragOver={handleDragOver}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical size={18} className="text-gray-400" />
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {widget.label}
                        </span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={w.visible}
                          onChange={() => toggleWidget(w.id)}
                        />
                        <span className="text-sm">Show</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow"
                  onClick={() => setShowCustomize(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Dynamic Widgets */}
          <div className="lg:col-span-2 space-y-6">
            {widgetPrefs
              .filter(
                (w) =>
                  w.visible &&
                  [
                    "currentCourses",
                    "recommendedCourses",
                    "completedCourses",
                  ].includes(w.id)
              )
              .map((w) => (
                <React.Fragment key={w.id}>{renderWidget(w.id)}</React.Fragment>
              ))}
          </div>
          {/* Right Sidebar Content - Dynamic Widgets */}
          <div className="space-y-6">
            {widgetPrefs
              .filter(
                (w) => w.visible && ["badges", "recentActivity"].includes(w.id)
              )
              .map((w) => (
                <React.Fragment key={w.id}>{renderWidget(w.id)}</React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
