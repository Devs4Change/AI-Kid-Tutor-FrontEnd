"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  LogIn,
  Shield,
  ArrowLeft,
} from "lucide-react";
// import { apiUpdatePassword } from "../services/auth"
import {
  apiLogin,
  apiResetPassword,
  apiUpdatePassword,
} from "../services/auth";

const LoginForm = () => {
  // State management
  const [form, setForm] = useState({ email: "", password: "" });
  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateForm, setUpdateForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeView, setActiveView] = useState("login"); // 'login', 'reset', 'update'

  // Form handlers
  const handleLoginChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleResetChange = (e) =>
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  const handleUpdateChange = (e) =>
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  const handleKeyPress = (e) => e.key === "Enter" && handleAction();
  const resetMessage = () => setMessage({ text: "", type: "" });

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return false;
    }
    return true;
  };

  // Main action handler
  const handleAction = async () => {
    resetMessage();
    if (activeView === "login") await handleLogin();
    else if (activeView === "reset") await handleResetPassword();
    else if (activeView === "update") await handleUpdatePassword();
  };

  // Login function
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiLogin({
        email: form.email,
        password: form.password,
      });

      // Log login info to the console
      console.log("Login Info:", {
        email: form.email,
        password: form.password,
        role: data.role,
      });

      localStorage.setItem("token", data.token);
      if (data.role) {
        localStorage.setItem("role", data.role);
      }
      localStorage.setItem("userEmail", form.email);
      // Always set userName for all users
      localStorage.setItem(
        "userName",
        data.user?.name || form.email.split("@")[0]
      );

      // Track login activity for admin dashboard
      const loginActivity = {
        userEmail: form.email,
        userName: data.user?.name || form.email,
        role: data.role,
        timestamp: new Date().toISOString(),
        action: "login",
      };

      const existingActivity = JSON.parse(
        localStorage.getItem("userActivity") || "[]"
      );
      existingActivity.unshift(loginActivity); // Add to beginning

      // Keep only last 50 activities to prevent localStorage from getting too large
      if (existingActivity.length > 50) {
        existingActivity.splice(50);
      }

      localStorage.setItem("userActivity", JSON.stringify(existingActivity));

      setMessage({ text: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        // Redirect based on user role
        if (data.role === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/courses";
        }
      }, 5000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const handleResetPassword = async () => {
    if (
      !resetForm.email ||
      !resetForm.newPassword ||
      !resetForm.confirmPassword
    ) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (!validatePassword(resetForm.newPassword)) return;

    setLoading(true);
    try {
      await apiResetPassword({
        email: resetForm.email,
        newPassword: resetForm.newPassword,
      });

      setMessage({ text: "Password reset successfully!", type: "success" });
      setTimeout(() => setActiveView("login"), 5000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Password reset failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Password update function
  const handleUpdatePassword = async () => {
    if (
      !updateForm.email ||
      !updateForm.oldPassword ||
      !updateForm.newPassword
    ) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    if (!validatePassword(updateForm.newPassword)) return;

    setLoading(true);
    try {
      await apiUpdatePassword({
        email: updateForm.email,
        oldPassword: updateForm.oldPassword,
        newPassword: updateForm.newPassword,
      });

      setMessage({ text: "Password updated successfully!", type: "success" });
      setTimeout(() => setActiveView("login"), 5000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Password update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Form render functions
  const renderLoginForm = () => (
    <>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleLoginChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPass ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleLoginChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
        >
          {showPass ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveView("reset")}
          className="text-sm text-pink-600 hover:text-blue-600 transition-colors duration-300"
        >
          Forgot password?
        </button>
        <button
          onClick={() => setActiveView("update")}
          className="text-sm text-blue-600 hover:text-pink-600 transition-colors duration-300"
        >
          Update password
        </button>
      </div>
    </>
  );

  const renderResetForm = () => (
    <>
      <button
        onClick={() => setActiveView("login")}
        className="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors duration-300 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
      </button>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={resetForm.email}
          onChange={handleResetChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPass ? "text" : "password"}
          name="newPassword"
          placeholder="New Password"
          value={resetForm.newPassword}
          onChange={handleResetChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPass ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={resetForm.confirmPassword}
          onChange={handleResetChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
        >
          {showPass ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );

  const renderUpdateForm = () => (
    <>
      <button
        onClick={() => setActiveView("login")}
        className="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors duration-300 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
      </button>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={updateForm.email}
          onChange={handleUpdateChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPass ? "text" : "password"}
          name="oldPassword"
          placeholder="Current Password"
          value={updateForm.oldPassword}
          onChange={handleUpdateChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPass ? "text" : "password"}
          name="newPassword"
          placeholder="New Password"
          value={updateForm.newPassword}
          onChange={handleUpdateChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
        >
          {showPass ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );

  // View title helpers
  const getTitle = () => {
    switch (activeView) {
      case "reset":
        return "Reset Password";
      case "update":
        return "Update Password";
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (activeView) {
      case "reset":
        return "Enter your email and new password";
      case "update":
        return "Enter your current and new password";
      default:
        return "Sign in to continue your journey";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-3 shadow-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-1">
            {getTitle()}
          </h1>
          <p className="text-gray-600">{getSubtitle()}</p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {activeView === "login" && renderLoginForm()}
          {activeView === "reset" && renderResetForm()}
          {activeView === "update" && renderUpdateForm()}

          <button
            onClick={handleAction}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {activeView === "login"
                  ? "Signing in..."
                  : activeView === "reset"
                  ? "Resetting password..."
                  : "Updating password..."}
              </>
            ) : (
              <>
                {activeView === "login" ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    {activeView === "reset"
                      ? "Reset Password"
                      : "Update Password"}
                  </>
                )}
              </>
            )}
          </button>
        </div>

        {activeView === "login" && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => (window.location.href = "/register")}
              className="text-pink-600 hover:text-blue-600 transition-colors duration-300 font-semibold"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
