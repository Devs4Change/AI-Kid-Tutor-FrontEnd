import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const LessonsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl">
              <BookOpen
                className="text-white"
                size={24}
                className="sm:w-8 sm:h-8"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                AI Lessons
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Explore interactive AI learning modules
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* AI Basics */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤖</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              AI Basics
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Learn the fundamentals of artificial intelligence
            </p>
            <button className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Start Learning
            </button>
          </div>

          {/* Robots & AI */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🦾</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Robots & AI
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Discover how robots work with AI
            </p>
            <button className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Start Learning
            </button>
          </div>

          {/* AI Games */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎮</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              AI Games
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Play games that teach AI concepts
            </p>
            <button className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
