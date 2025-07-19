import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Brain,
  Trophy,
  Settings,
  HelpCircle,
  User,
  Bell,
  Star,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Shield,
  Globe,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({
  userName,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const isAdminRoute = location.pathname.startsWith("/dashboard/admin");
  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Globe,
      path: "/",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    // Only show Admin Panel if user is admin AND on /dashboard/admin route
    ...(role === "admin" && isAdminRoute
      ? [
          {
            id: "admin",
            label: "Admin Panel",
            icon: Shield,
            path: "/dashboard/admin",
          },
        ]
      : []),
    {
      id: "practice",
      label: "Practice Zone",
      icon: Brain,
      path: "/practice",
      submenu: [
        { id: "quizzes", label: "Fun Quizzes", path: "/practice/quizzes" },
        { id: "coding", label: "Simple Coding", path: "/practice/coding" },
        { id: "projects", label: "Mini Projects", path: "/practice/projects" },
      ],
    },
    {
      id: "games",
      label: "AI Games",
      icon: Gamepad2,
      path: "/games",
    },
  ];

  const userMenuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      path: "/profile",
    },
    {
      id: "customizeDashboard",
      label: "Customize Dashboard",
      icon: Settings,
      path: null, // This will trigger a custom action
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
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
    } else if (item.id === "customizeDashboard") {
      // Trigger customize dashboard modal
      window.dispatchEvent(new CustomEvent("openCustomizeDashboard"));
    }
    // Close mobile menu when item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarClasses = `
    ${isExpanded ? "w-64 lg:w-72" : "w-16 lg:w-20"} 
    bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-in-out
    flex flex-col h-full
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    fixed md:relative z-40 top-0 left-0
    md:min-h-screen
  `;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Spacer for mobile menu button on mobile */}
        <div className="h-16 md:hidden"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                !isExpanded && "justify-center"
              }`}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              {isExpanded && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                    AI Kid Tutor
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Learning Made Fun!
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                        {userName ? userName.charAt(0).toUpperCase() : "S"}
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </>
                );
              })()}
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white truncate">
                  {userName || "Student"}
                </p>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Student
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 sm:space-y-2 px-2 sm:px-4">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 group ${
                    activeSection === item.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      !isExpanded
                        ? "justify-center w-full"
                        : "space-x-2 sm:space-x-3"
                    }`}
                  >
                    <item.icon size={18} className="sm:w-5 sm:h-5" />
                    {isExpanded && (
                      <>
                        <span className="font-medium text-sm sm:text-base truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {isExpanded && item.submenu && (
                    <div className="transition-transform duration-200">
                      {expandedMenus[item.id] ? (
                        <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                      ) : (
                        <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {isExpanded && item.submenu && expandedMenus[item.id] && (
                  <div className="ml-4 sm:ml-6 mt-1 sm:mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveSection(subItem.id);
                          if (subItem.path) {
                            navigate(subItem.path);
                          }
                          // Close mobile menu when item is clicked
                          if (window.innerWidth < 768) {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          activeSection === subItem.id
                            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full opacity-50"></div>
                        <span className="truncate">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-4 space-y-1 sm:space-y-2">
          {/* User Menu Items */}
          {userMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (item.path) {
                  navigate(item.path);
                } else if (item.id === "customizeDashboard") {
                  // Trigger customize dashboard modal
                  window.dispatchEvent(
                    new CustomEvent("openCustomizeDashboard")
                  );
                }
                // Close mobile menu when item is clicked
                if (window.innerWidth < 768) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className={`w-full flex items-center p-2 sm:p-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
              } ${!isExpanded && "justify-center"}`}
            >
              <item.icon size={18} className="sm:w-5 sm:h-5" />
              {isExpanded && (
                <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base truncate">
                  {item.label}
                </span>
              )}
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-2 sm:p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              !isExpanded && "justify-center"
            }`}
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
            {isExpanded && (
              <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
