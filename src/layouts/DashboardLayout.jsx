import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import FloatingChat from "../components/FloatingChat";
import { Sparkles } from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("role") || "student";
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    // Don't remove userEmail to preserve lesson completion data
    // localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Main Layout */}
      <div className="flex h-screen">
        {userRole === "admin" ? (
          <AdminSidebar
            userName={userName}
            handleLogout={handleLogout}
            isMobileMenuOpen={isMobileSidebarOpen}
            setIsMobileMenuOpen={setIsMobileSidebarOpen}
          />
        ) : (
          <Sidebar
            userName={userName}
            handleLogout={handleLogout}
            isMobileMenuOpen={isMobileSidebarOpen}
            setIsMobileMenuOpen={setIsMobileSidebarOpen}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </div>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default DashboardLayout;
