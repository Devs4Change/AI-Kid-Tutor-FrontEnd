import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Lock,
  Moon,
  Sun,
  BookOpen,
  Key,
  ClipboardCopy,
  Image as ImageIcon,
  Activity,
  Check,
  XCircle,
  Settings,
  Shield,
  Palette,
  Server,
  Code,
  BarChart3,
} from "lucide-react";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "theme",
    label: "Appearance",
    icon: Palette,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "platform",
    label: "Platform",
    icon: Server,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "apikey",
    label: "API Key",
    icon: Code,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "activity",
    label: "Activity",
    icon: BarChart3,
    color: "from-teal-500 to-blue-500",
  },
];

const AdminSettings = () => {
  // State for tabs
  const [tab, setTab] = useState("profile");

  // Profile
  const [adminName, setAdminName] = useState("Alex Thompson");
  const [adminEmail, setAdminEmail] = useState("alex@company.com");
  const [avatar, setAvatar] = useState("");

  // Security
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Theme
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("blue");

  // Platform
  const [platformName, setPlatformName] = useState("EduPlatform Pro");
  const [platformLogo, setPlatformLogo] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // API Key
  const [apiKey, setApiKey] = useState("sk-1234567890abcdef1234567890abcdef");
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  // Activity Log
  const [activity] = useState([
    {
      timestamp: Date.now() - 3600000,
      action: "login",
      details: "Successful admin login",
    },
    {
      timestamp: Date.now() - 7200000,
      action: "settings_update",
      details: "Theme changed to dark mode",
    },
    {
      timestamp: Date.now() - 10800000,
      action: "user_management",
      details: "Added new user: john@example.com",
    },
    {
      timestamp: Date.now() - 14400000,
      action: "api_key_regenerated",
      details: "API key regenerated for security",
    },
    {
      timestamp: Date.now() - 18000000,
      action: "platform_update",
      details: "Platform name updated",
    },
  ]);

  // Add state for save feedback
  const [profileSaved, setProfileSaved] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPlatformLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminEmail", adminEmail);
    localStorage.setItem("adminAvatar", avatar);
    // Also update userProfile for sidebar sync
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    userProfile.name = adminName;
    userProfile.email = adminEmail;
    userProfile.avatar = avatar;
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const currentTab = TABS.find((t) => t.id === tab);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentTab.color} opacity-10`}
        ></div>
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <div
                className={`p-3 rounded-2xl bg-gradient-to-r ${currentTab.color} shadow-lg`}
              >
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className={`text-4xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Admin Settings
                </h1>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Manage your platform and account preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Tab Navigation */}
        <div className="mb-8 -mt-4">
          <div
            className={`p-2 rounded-2xl ${
              theme === "dark"
                ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                : "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {TABS.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                    tab === id
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                  {tab === id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {tab === "profile" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Profile Settings
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-32 h-32 rounded-3xl object-cover border-4 border-gradient-to-r from-blue-500 to-cyan-500 shadow-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <UserPlus className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <label className="absolute inset-0 cursor-pointer rounded-3xl bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="text-white font-medium">Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <button
                    onClick={handleProfileSave}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                  {profileSaved && (
                    <div className="flex items-center gap-2 text-green-500 font-medium p-4 bg-green-500/10 rounded-2xl border border-green-500/20 mt-2">
                      <Check className="w-5 h-5" />
                      Profile saved!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Security Settings
                </h2>
              </div>

              <div className="max-w-md space-y-6">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />

                <button
                  onClick={() => {
                    if (newPassword !== confirmPassword) {
                      setPasswordError("Passwords do not match.");
                      return;
                    }
                    setPasswordChanged(true);
                    setPasswordError("");
                    setTimeout(() => setPasswordChanged(false), 3000);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Update Password
                </button>

                {passwordChanged && (
                  <div className="flex items-center gap-2 text-green-500 font-medium p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <Check className="w-5 h-5" />
                    Password updated successfully!
                  </div>
                )}

                {passwordError && (
                  <div className="flex items-center gap-2 text-red-500 font-medium p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <XCircle className="w-5 h-5" />
                    {passwordError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {tab === "theme" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Appearance Settings
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Theme Mode
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
                        theme === "light"
                          ? "border-purple-500 bg-purple-500/10"
                          : theme === "dark"
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <Sun className="w-8 h-8 text-yellow-500" />
                      <div className="text-left">
                        <div
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Light Mode
                        </div>
                        <div
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Clean and bright interface
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <Moon className="w-8 h-8 text-blue-400" />
                      <div className="text-left">
                        <div
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Dark Mode
                        </div>
                        <div
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Easy on the eyes
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Accent Color
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {["blue", "purple", "green", "red", "yellow", "pink"].map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-12 h-12 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                            accentColor === color
                              ? "ring-4 ring-white ring-opacity-50"
                              : ""
                          }`}
                          style={{
                            background: {
                              blue: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                              purple:
                                "linear-gradient(135deg, #8b5cf6, #6366f1)",
                              green:
                                "linear-gradient(135deg, #10b981, #059669)",
                              red: "linear-gradient(135deg, #ef4444, #dc2626)",
                              yellow:
                                "linear-gradient(135deg, #f59e0b, #d97706)",
                              pink: "linear-gradient(135deg, #ec4899, #db2777)",
                            }[color],
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Tab */}
          {tab === "platform" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Platform Settings
                </h2>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      {platformLogo ? (
                        <img
                          src={platformLogo}
                          alt="Platform Logo"
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <ImageIcon className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <label className="absolute inset-0 cursor-pointer rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <span className="text-white font-medium text-sm">
                          Change
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="Enter platform name"
                    />
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl border-2 ${
                    maintenanceMode
                      ? "border-red-500 bg-red-500/10"
                      : "border-green-500 bg-green-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Maintenance Mode
                      </h3>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {maintenanceMode
                          ? "Platform is currently under maintenance"
                          : "Platform is running normally"}
                      </p>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        maintenanceMode
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                      }`}
                    >
                      {maintenanceMode ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Key Tab */}
          {tab === "apikey" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  API Key Management
                </h2>
              </div>

              <div className="space-y-6">
                <div
                  className={`p-6 rounded-2xl ${
                    theme === "dark"
                      ? "bg-yellow-500/10 border border-yellow-500/20"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-5 h-5 text-yellow-600" />
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-yellow-400" : "text-yellow-700"
                      }`}
                    >
                      Active API Key
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      className={`flex-1 p-4 rounded-2xl font-mono text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-300"
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        setApiKeyCopied(true);
                        setTimeout(() => setApiKeyCopied(false), 2000);
                      }}
                      className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        apiKeyCopied
                          ? "bg-green-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {apiKeyCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ClipboardCopy className="w-4 h-4" />
                        )}
                        {apiKeyCopied ? "Copied!" : "Copy"}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const newKey =
                          "sk-" + Math.random().toString(36).substring(2, 34);
                        setApiKey(newKey);
                        setApiKeyCopied(false);
                      }}
                      className="px-6 py-4 bg-gray-500 text-white rounded-2xl font-medium hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Regenerate
                    </button>
                  </div>

                  <p
                    className={`text-sm mt-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Keep your API key secure. Never share it publicly or expose
                    it in client-side code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {tab === "activity" && (
            <div
              className={`rounded-3xl p-8 ${
                theme === "dark"
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Activity Log
                </h2>
              </div>

              <div className="space-y-4">
                {activity.length === 0 ? (
                  <div
                    className={`text-center py-12 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No recent activity</p>
                  </div>
                ) : (
                  activity.map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                        theme === "dark"
                          ? "bg-gray-700/30 border-gray-600 hover:border-gray-500"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              item.action === "login"
                                ? "bg-green-100 text-green-600"
                                : item.action === "settings_update"
                                ? "bg-blue-100 text-blue-600"
                                : item.action === "user_management"
                                ? "bg-purple-100 text-purple-600"
                                : item.action === "api_key_regenerated"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <h3
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.action
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h3>
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.details}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
