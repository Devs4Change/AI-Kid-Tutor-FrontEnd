import React, { useState, useRef, useEffect } from "react";
import { Brain, Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add login state
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Check login status on component mount
  useEffect(() => {
    console.log("NavBar useEffect running - checking auth status");

    // Check if user is logged in (you can replace this with your auth logic)
    const checkLoginStatus = () => {
      try {
        // Debug: Log all localStorage keys to see what's available
        console.log("All localStorage keys:", Object.keys(localStorage));
        console.log("All localStorage items:", localStorage);

        // Check for your specific auth pattern (matches your login code)
        const token = localStorage.getItem("token");

        console.log("Auth check results:", { token });

        const isAuthenticated = !!token;
        console.log("Final isAuthenticated:", isAuthenticated);

        setIsLoggedIn(isAuthenticated);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Debug: Log current login state
  useEffect(() => {
    console.log("Current isLoggedIn state:", isLoggedIn);
  }, [isLoggedIn]);

  // Debugging logs
  useEffect(() => {
    console.log("Mobile menu state:", isMenuOpen);
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    console.log("Toggling menu from", isMenuOpen, "to", !isMenuOpen);
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Clear auth data but preserve userEmail for lesson completion data
    localStorage.removeItem("token");
    // Don't remove userEmail to preserve lesson completion data
    // localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setShowDropdown(false);
    setIsMenuOpen(false);

    // Redirect to home or login page
    navigate("/");
  };

  // Listen for storage changes (when user logs in from another tab/component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setIsLoggedIn(!!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = () => {
    navigate("/login");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              AI Kid Tutor
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {["Home", "Features", "About", "Pricing", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const element = document.getElementById(item.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-gray-700 hover:text-pink-500 font-medium text-sm sm:text-base transition-colors duration-300"
              >
                {item}
              </button>
            ))}

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                {isLoggedIn ? "Account" : "Accounts"}{" "}
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-white rounded-lg sm:rounded-xl shadow-xl ring-1 ring-pink-100 z-10">
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={handleRegister}
                        className="block w-full text-left px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 hover:text-pink-600 rounded-t-lg sm:rounded-t-xl"
                      >
                        Register
                      </button>
                      <button
                        onClick={handleLogin}
                        className="block w-full text-left px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 hover:text-blue-600 rounded-b-lg sm:rounded-b-xl"
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 hover:text-red-600 rounded-lg sm:rounded-xl"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {["Home", "Features", "About", "Pricing", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const element = document.getElementById(item.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
              >
                {item}
              </button>
            ))}
            <div className="border-t mt-2 pt-2 space-y-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={handleRegister}
                    className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
                  >
                    Register
                  </button>
                  <button
                    onClick={handleLogin}
                    className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
                  >
                    Login
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-500 text-base"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
