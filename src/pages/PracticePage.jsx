import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowLeft } from "lucide-react";

const PracticePage = () => {
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
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 sm:p-3 rounded-xl">
              <Brain
                className="text-white"
                size={24}
                className="sm:w-8 sm:h-8"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Practice Zone
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Sharpen your AI skills with interactive exercises
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Fun Quizzes */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🧩</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Fun Quizzes
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Test your knowledge with interactive quizzes
            </p>
            <button className="w-full sm:w-auto bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base">
              Start Quiz
            </button>
          </div>

          {/* Simple Coding */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💻</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Simple Coding
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Learn basic programming concepts
            </p>
            <button className="w-full sm:w-auto bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base">
              Start Coding
            </button>
          </div>

          {/* Mini Projects */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Mini Projects
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Build small AI projects step by step
            </p>
            <button className="w-full sm:w-auto bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base">
              Start Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
