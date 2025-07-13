import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    age: "",
    grade: "",
    interests: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem("userProfile");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("name");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Set default profile data
      setProfile({
        name: userName || "Student",
        email: userEmail || "",
        avatar: "",
        bio: "Tell us about yourself!",
        age: "",
        grade: "",
        interests: [],
      });
    }
  };

  const handleProfileUpdate = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleProfileUpdate("avatar", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestChange = (interest) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div
          className={`rounded-lg shadow-lg p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
        >
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blue-400 to-purple-500 ${
                      theme === "dark" ? "text-white" : "text-white"
                    }`}
                  >
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "👨‍🎓"}
                  </div>
                )}
              </div>

              {/* Online Status Indicator */}
              <div className="absolute top-4 right-4 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>

              {isEditing && (
                <label className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-110">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileUpdate("name", e.target.value)}
                className={`w-full text-2xl font-bold text-center mb-3 p-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors`}
              />
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {profile.name}
                </h1>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Online
                  </span>
                </div>
              </div>
            )}

            <p className="text-gray-500 mb-6">{profile.email}</p>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-medium"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  rows="4"
                  className={`w-full p-3 rounded-lg border-2 text-lg bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleProfileUpdate("age", e.target.value)}
                    className={`w-full p-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors`}
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={profile.grade}
                    onChange={(e) =>
                      handleProfileUpdate("grade", e.target.value)
                    }
                    className={`w-full p-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors`}
                    placeholder="Your grade"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Interests
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "AI",
                    "Robotics",
                    "Coding",
                    "Science",
                    "Math",
                    "Art",
                    "Music",
                    "Sports",
                    "Reading",
                    "Gaming",
                  ].map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestChange(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        profile.interests.includes(interest)
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-blue-200 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {(profile.age || profile.grade) && (
                <div className="flex justify-center space-x-8">
                  {profile.age && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Age
                      </p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {profile.age}
                      </p>
                    </div>
                  )}
                  {profile.grade && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Grade
                      </p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {profile.grade}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {profile.interests.length > 0 && (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Interests
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
