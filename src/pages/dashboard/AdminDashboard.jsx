import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Trophy,
  Settings,
  BarChart2,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Book,
} from "lucide-react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/courses";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/users";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../services/achievements";

const mockUsers = [
  { id: 1, name: "Emma Johnson", email: "emma@email.com", role: "student" },
  { id: 2, name: "Alex Smith", email: "alex@email.com", role: "student" },
  { id: 3, name: "Parent User", email: "parent@email.com", role: "parent" },
  { id: 4, name: "Admin User", email: "admin@email.com", role: "admin" },
];

const mockCourses = [
  {
    id: 1,
    title: "AI for Kids",
    category: "Artificial Intelligence",
    status: "Published",
  },
  { id: 2, title: "Robotics 101", category: "Robotics", status: "Draft" },
  {
    id: 3,
    title: "Fun with Coding",
    category: "Programming",
    status: "Published",
  },
];

const mockAchievements = [
  {
    id: 1,
    title: "First Lesson",
    icon: "🎯",
    description: "Completed your first lesson",
  },
  {
    id: 2,
    title: "Quiz Master",
    icon: "🧠",
    description: "Scored 100% on a quiz",
  },
  {
    id: 3,
    title: "AI Explorer",
    icon: "🤖",
    description: "Completed all beginner lessons",
  },
];

const mockAnalytics = {
  totalUsers: 120,
  activeUsers: 87,
  lessonsCompleted: 340,
  totalLessons: 15,
};

const TABS = [
  { id: "users", label: "Users", icon: Users },
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "courses", label: "Courses", icon: Book },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "activity", label: "Recent Activity", icon: BarChart2 },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");

  // Function to get completion data from localStorage
  const getCompletionData = () => {
    const completionData = {};
    const allKeys = Object.keys(localStorage);

    // Find all completedLessons keys
    allKeys.forEach((key) => {
      if (key.startsWith("completedLessons_")) {
        // Parse key format: completedLessons_${courseId}_${userEmail}
        const parts = key.replace("completedLessons_", "").split("_");
        if (parts.length >= 2) {
          const courseId = parts[0];
          const userEmail = parts.slice(1).join("_"); // Handle emails with underscores
          const completedLessons = JSON.parse(
            localStorage.getItem(key) || "[]"
          );

          if (!completionData[userEmail]) {
            completionData[userEmail] = {};
          }
          completionData[userEmail][courseId] = completedLessons;
        }
      }
    });

    return completionData;
  };

  // Function to get user completion stats
  const getUserCompletionStats = (userId) => {
    const completionData = getCompletionData();
    let totalCompletedLessons = 0;
    let completedCourses = 0;

    // Find user by email (assuming userId is email for now)
    const user = users.find((u) => u._id === userId || u.email === userId);
    if (!user) return { totalCompletedLessons: 0, completedCourses: 0 };

    const userEmail = user.email;
    const userCompletionData = completionData[userEmail] || {};

    Object.values(userCompletionData).forEach((completedLessons) => {
      totalCompletedLessons += completedLessons.length;
      // If all lessons in a course are completed, count it as completed course
      if (completedLessons.length > 0) {
        completedCourses++;
      }
    });

    return {
      totalCompletedLessons,
      completedCourses,
    };
  };

  // Function to get user activity data
  const getUserActivity = () => {
    const activityData = JSON.parse(
      localStorage.getItem("userActivity") || "[]"
    );
    return activityData.map((activity) => ({
      ...activity,
      formattedTime: new Date(activity.timestamp).toLocaleString(),
      timeAgo: getTimeAgo(new Date(activity.timestamp)),
    }));
  };

  // Function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        if (activeTab === "courses") {
          setCoursesLoading(true);
          const data = await getCourses();
          setCourses(data);
        } else if (activeTab === "users") {
          setUsersLoading(true);
          const data = await getUsers();
          setUsers(data);
        } else if (activeTab === "achievements") {
          setAchievementsLoading(true);
          const data = await getAchievements();
          setAchievements(data);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Failed to load ${activeTab}`);
      } finally {
        setCoursesLoading(false);
        setUsersLoading(false);
        setAchievementsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // CRUD Functions
  const handleAdd = async (itemType) => {
    try {
      console.log("Adding item:", itemType, formData); // Debug log
      let newItem;
      switch (itemType) {
        case "user":
          newItem = await createUser(formData, token);
          setUsers([...users, newItem]);
          break;
        case "course":
          newItem = await createCourse(formData, token);
          setCourses([...courses, newItem]);
          break;
        case "achievement":
          newItem = await createAchievement(formData, token);
          setAchievements([...achievements, newItem]);
          break;
        default:
          console.log("Unknown item type:", itemType); // Debug log
          break;
      }
      setShowAddModal(false);
      setFormData({});
      setSuccess(
        `${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } added successfully!`
      );
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error(`Error adding ${itemType}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to add ${itemType}`;
      setError(errorMessage);
    }
  };

  const handleEdit = async (itemType, id) => {
    try {
      let updatedItem;
      switch (itemType) {
        case "user":
          updatedItem = await updateUser(id, formData, token);
          setUsers(users.map((user) => (user._id === id ? updatedItem : user)));
          break;
        case "course":
          updatedItem = await updateCourse(id, formData, token);
          setCourses(
            courses.map((course) => (course._id === id ? updatedItem : course))
          );
          break;
        case "achievement":
          updatedItem = await updateAchievement(id, formData, token);
          setAchievements(
            achievements.map((achievement) =>
              achievement._id === id ? updatedItem : achievement
            )
          );
          break;
        default:
          break;
      }
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({});
    } catch (err) {
      console.error(`Error updating ${itemType}:`, err);
      setError(`Failed to update ${itemType}`);
    }
  };

  const handleDelete = async (itemType, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      return;
    }

    try {
      switch (itemType) {
        case "user":
          await deleteUser(id, token);
          setUsers(users.filter((user) => user._id !== id));
          break;
        case "course":
          await deleteCourse(id, token);
          setCourses(courses.filter((course) => course._id !== id));
          break;
        case "achievement":
          await deleteAchievement(id, token);
          setAchievements(
            achievements.filter((achievement) => achievement._id !== id)
          );
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error deleting ${itemType}:`, err);
      setError(`Failed to delete ${itemType}`);
    }
  };

  const openEditModal = (item, itemType) => {
    setEditingItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const openAddModal = (itemType) => {
    setFormData({});
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Manage users, lessons, courses, achievements, and view platform
            analytics.
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg font-medium transition-colors space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.charAt(0)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-blue-700">
                User Management
              </h2>
              <button
                onClick={() => openAddModal("user")}
                className="flex items-center bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-600 text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 mr-1 sm:mr-2" /> Add User
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-xs sm:text-sm">Name</th>
                      <th className="py-2 text-xs sm:text-sm hidden sm:table-cell">
                        Email
                      </th>
                      <th className="py-2 text-xs sm:text-sm">Role</th>
                      <th className="py-2 text-xs sm:text-sm hidden md:table-cell">
                        Lessons
                      </th>
                      <th className="py-2 text-xs sm:text-sm hidden md:table-cell">
                        Courses
                      </th>
                      <th className="py-2 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const completionStats = getUserCompletionStats(user._id);
                      return (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-blue-50"
                        >
                          <td className="py-2 text-xs sm:text-sm">
                            {user.name}
                          </td>
                          <td className="py-2 text-xs sm:text-sm hidden sm:table-cell">
                            {user.email}
                          </td>
                          <td className="py-2 text-xs sm:text-sm capitalize">
                            {user.role}
                          </td>
                          <td className="py-2 text-xs sm:text-sm hidden md:table-cell">
                            <span className="bg-blue-100 text-blue-800 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">
                              {completionStats.totalCompletedLessons}
                            </span>
                          </td>
                          <td className="py-2 text-xs sm:text-sm hidden md:table-cell">
                            <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">
                              {completionStats.completedCourses}
                            </span>
                          </td>
                          <td className="py-2 space-x-1 sm:space-x-2">
                            <button
                              onClick={() => openEditModal(user, "user")}
                              className="inline-flex items-center px-1 sm:px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete("user", user._id)}
                              className="inline-flex items-center px-1 sm:px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === "lessons" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-700">
                Lesson Management
              </h2>
              <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" /> Add Lesson
              </button>
            </div>
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Title</th>
                  <th className="py-2">Level</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-green-50">
                  <td className="py-2 text-gray-500" colSpan="4">
                    Lessons management coming soon...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-indigo-700">
                Course Management
              </h2>
              <button
                onClick={() => openAddModal("course")}
                className="flex items-center bg-indigo-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 mr-1 sm:mr-2" /> Add Course
              </button>
            </div>
            {coursesLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading courses...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-xs sm:text-sm">Title</th>
                      <th className="py-2 text-xs sm:text-sm hidden sm:table-cell">
                        Category
                      </th>
                      <th className="py-2 text-xs sm:text-sm">Status</th>
                      <th className="py-2 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course._id || course.id}
                        className="border-b hover:bg-indigo-50"
                      >
                        <td className="py-2 text-xs sm:text-sm">
                          {course.title}
                        </td>
                        <td className="py-2 text-xs sm:text-sm hidden sm:table-cell">
                          {course.category}
                        </td>
                        <td className="py-2 text-xs sm:text-sm">
                          {course.status}
                        </td>
                        <td className="py-2 space-x-1 sm:space-x-2">
                          <button
                            onClick={() => openEditModal(course, "course")}
                            className="inline-flex items-center px-1 sm:px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete("course", course._id)}
                            className="inline-flex items-center px-1 sm:px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-yellow-700">
                Achievements
              </h2>
              <button
                onClick={() => openAddModal("achievement")}
                className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Badge
              </button>
            </div>

            {achievementsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading achievements...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <div
                    key={ach._id}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-4"
                  >
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <h3 className="font-semibold text-yellow-800">
                        {ach.title}
                      </h3>
                      <p className="text-yellow-700 text-sm">
                        {ach.description}
                      </p>
                    </div>
                    <div className="ml-auto flex space-x-1">
                      <button
                        onClick={() => openEditModal(ach, "achievement")}
                        className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("achievement", ach._id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-orange-700 mb-4">
              Recent User Activity
            </h2>
            {(() => {
              const activities = getUserActivity();
              return (
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity
                    </div>
                  ) : (
                    activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {activity.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {activity.userName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.action === "login"
                                ? "Logged in"
                                : activity.action === "lesson_completed"
                                ? `Completed lesson: ${activity.lessonTitle}`
                                : activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.userEmail} • {activity.role}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.timeAgo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.formattedTime}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-700 mb-4">
              Platform Analytics
            </h2>
            {(() => {
              const completionData = getCompletionData();
              const totalCompletedLessons = Object.values(
                completionData
              ).reduce(
                (total, userData) =>
                  total +
                  Object.values(userData).reduce(
                    (sum, lessons) => sum + lessons.length,
                    0
                  ),
                0
              );
              const completedCourses = Object.values(completionData).reduce(
                (total, userData) =>
                  total +
                  Object.values(userData).filter(
                    (lessons) => lessons.length > 0
                  ).length,
                0
              );
              const totalUsers = users.length;
              const activeUsers = users.filter((user) => {
                const userStats = getUserCompletionStats(user._id);
                return userStats.totalCompletedLessons > 0;
              }).length;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center">
                    <span className="text-4xl font-bold text-blue-700">
                      {totalUsers}
                    </span>
                    <span className="text-gray-700 mt-2">Total Users</span>
                  </div>
                  <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center">
                    <span className="text-4xl font-bold text-green-700">
                      {activeUsers}
                    </span>
                    <span className="text-gray-700 mt-2">Active Users</span>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-6 flex flex-col items-center">
                    <span className="text-4xl font-bold text-yellow-700">
                      {totalCompletedLessons}
                    </span>
                    <span className="text-gray-700 mt-2">
                      Lessons Completed
                    </span>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-6 flex flex-col items-center">
                    <span className="text-4xl font-bold text-purple-700">
                      {completedCourses}
                    </span>
                    <span className="text-gray-700 mt-2">
                      Courses Completed
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Platform Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Maintenance Mode</span>
                <button className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium">
                  Off
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Send Announcement</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Add{" "}
                {activeTab.slice(0, -1).charAt(0).toUpperCase() +
                  activeTab.slice(0, -1).slice(1)}
              </h3>
              <div className="space-y-4">
                {activeTab === "users" && (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                      value={formData.role || "student"}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </>
                )}
                {activeTab === "courses" && (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                      value={formData.level || "Beginner"}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 hours)"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Lessons"
                      value={formData.lessons || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lessons: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </>
                )}
                {activeTab === "achievements" && (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Icon (emoji)"
                      value={formData.icon || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAdd(activeTab.slice(0, -1))}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Edit{" "}
                {activeTab.slice(0, -1).charAt(0).toUpperCase() +
                  activeTab.slice(0, -1).slice(1)}
              </h3>
              <div className="space-y-4">
                {activeTab === "users" && (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                      value={formData.role || "student"}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </>
                )}
                {activeTab === "courses" && (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                      value={formData.level || "Beginner"}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 hours)"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Lessons"
                      value={formData.lessons || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lessons: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </>
                )}
                {activeTab === "achievements" && (
                  <>
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Icon (emoji)"
                      value={formData.icon || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleEdit(activeTab.slice(0, -1), editingItem._id)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
