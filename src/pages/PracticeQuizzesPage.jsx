import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Trophy, Star } from "lucide-react";

const PracticeQuizzesPage = () => {
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizzes = [
    {
      id: 1,
      title: "AI Basics Quiz",
      description: "Test your knowledge about artificial intelligence",
      icon: "🤖",
      questions: [
        {
          question: "What does AI stand for?",
          options: [
            "Artificial Intelligence",
            "Advanced Internet",
            "Automated Information",
            "Applied Innovation",
          ],
          correct: 0,
        },
        {
          question: "Which of these is an example of AI?",
          options: [
            "A calculator",
            "A voice assistant like Siri",
            "A television",
            "A refrigerator",
          ],
          correct: 1,
        },
        {
          question: "What is machine learning?",
          options: [
            "Teaching computers to learn from data",
            "Building robots",
            "Playing video games",
            "Writing code",
          ],
          correct: 0,
        },
      ],
    },
    {
      id: 2,
      title: "Coding Fundamentals",
      description: "Learn about basic programming concepts",
      icon: "💻",
      questions: [
        {
          question: "What is a variable in programming?",
          options: [
            "A type of computer",
            "A container that stores data",
            "A programming language",
            "A type of game",
          ],
          correct: 1,
        },
        {
          question: "What does HTML stand for?",
          options: [
            "High Tech Modern Language",
            "HyperText Markup Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language",
          ],
          correct: 1,
        },
        {
          question:
            "Which symbol is used for comments in most programming languages?",
          options: ["//", "**", "##", "&&"],
          correct: 0,
        },
      ],
    },
    {
      id: 3,
      title: "Robotics Quiz",
      description: "Explore the world of robots and automation",
      icon: "🦾",
      questions: [
        {
          question: "What is a robot?",
          options: [
            "A type of computer",
            "A machine that can perform tasks automatically",
            "A video game character",
            "A type of car",
          ],
          correct: 1,
        },
        {
          question: "Which part of a robot helps it move?",
          options: ["The brain", "The sensors", "The actuators", "The battery"],
          correct: 2,
        },
        {
          question: "What do robots use to understand their environment?",
          options: ["Sensors", "Batteries", "Screens", "Speakers"],
          correct: 0,
        },
      ],
    },
  ];

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (
      selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct
    ) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / currentQuiz.questions.length) * 100;
    if (percentage >= 90) return "Excellent! You're a superstar! 🌟";
    if (percentage >= 80) return "Great job! Keep up the good work! 🎉";
    if (percentage >= 70) return "Good effort! Keep practicing! 👍";
    return "Keep trying! You'll get better with practice! 💪";
  };

  if (currentQuiz && !showResult) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={resetQuiz}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Quizzes
            </button>
          </div>

          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{currentQuiz.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentQuiz.title}
                </h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentQuiz.questions.length}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) /
                      currentQuiz.questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>{" "}
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedAnswer === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {currentQuestionIndex + 1 === currentQuiz.questions.length
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && currentQuiz) {
    const percentage = (score / currentQuiz.questions.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">{getScoreMessage()}</p>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
              <div className="text-4xl font-bold mb-2">
                {score}/{currentQuiz.questions.length}
              </div>
              <div className="text-2xl font-bold">
                {Math.round(percentage)}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/practice")}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Practice Zone
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/practice")}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Practice Zone
          </button>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-3 rounded-xl">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Fun Quizzes</h1>
              <p className="text-gray-600">
                Test your knowledge with interactive quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startQuiz(quiz)}
            >
              <div className="text-4xl mb-4">{quiz.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {quiz.title}
              </h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {quiz.questions.length} questions
                </span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuizzesPage;
