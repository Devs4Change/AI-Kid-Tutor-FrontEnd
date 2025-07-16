import React, { useState } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  BarChart2,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Brain,
  Trophy,
  Plus,
  Edit,
  Trash2,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({
  userName,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  const adminNavigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Globe,
      path: "/",
    },
    {
      id: "dashboard",
      label: "Admin Dashboard",
      icon: Home,
      path: "/dashboard/admin",
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      path: "/courses",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleItemClick = (item) => {
    setActiveSection(item.id);
    if (item.submenu) {
      toggleMenu(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
    // Close mobile menu when item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarClasses = `
    ${isExpanded ? "w-72" : "w-20"} 
    bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl border-r border-blue-700 
    transition-all duration-300 ease-in-out
    flex flex-col h-screen
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    fixed md:relative z-40 top-0
  `;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Spacer for header on mobile */}
        <div className="h-16 md:hidden"></div>

        {/* Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                !isExpanded && "justify-center"
              }`}
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              {isExpanded && (
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-blue-200">System Management</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:block p-1 rounded-lg hover:bg-blue-700 transition-colors text-white"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-blue-700">
          <div
            className={`flex items-center ${
              !isExpanded ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="relative">
              {(() => {
                const savedProfile = localStorage.getItem("userProfile");
                const profileData = savedProfile
                  ? JSON.parse(savedProfile)
                  : null;
                const profileImage = profileData?.avatar;

                return (
                  <>
                    {profileImage ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {userName ? userName.charAt(0).toUpperCase() : "A"}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-800"></div>
                  </>
                );
              })()}
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userName || "Admin User"}
                </p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {adminNavigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  } ${!isExpanded && "justify-center"}`}
                >
                  <item.icon className="w-5 h-5" />
                  {isExpanded && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.submenu && (
                        <ChevronDown
                          className={`ml-auto w-4 h-4 transition-transform ${
                            expandedMenus[item.id] ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && expandedMenus[item.id] && isExpanded && (
                  <ul className="mt-2 ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => navigate(subItem.path)}
                          className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
                        >
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isExpanded && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
