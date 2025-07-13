import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AIPuzzleGame = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userSolution, setUserSolution] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const puzzles = [
    {
      id: 1,
      title: "Pattern Recognition",
      description:
        "Find the next number in the sequence using AI pattern recognition",
      icon: "🔢",
      question: "What comes next: 2, 4, 8, 16, ?",
      hint: "Each number is multiplied by 2 to get the next number",
      answer: "32",
      explanation:
        "This is a geometric sequence where each number is multiplied by 2. 2×2=4, 4×2=8, 8×2=16, 16×2=32",
    },
    {
      id: 2,
      title: "Logic Gates",
      description: "Solve the logic gate puzzle using AI reasoning",
      icon: "⚡",
      question: "If A=1, B=0, what is the output of A AND B?",
      hint: "AND gate outputs 1 only when both inputs are 1",
      answer: "0",
      explanation:
        "AND gate outputs 1 only when both inputs are 1. Since A=1 and B=0, the output is 0.",
    },
    {
      id: 3,
      title: "Color Classification",
      description: "Classify objects by color using AI image recognition logic",
      icon: "🎨",
      question: "If an AI sees: 🍎🍊🍌🍇, which color group do most belong to?",
      hint: "Look at the natural colors of these fruits",
      answer: "yellow",
      explanation:
        "Most of these fruits (banana, orange) are naturally yellow/orange colored.",
    },
    {
      id: 4,
      title: "Decision Tree",
      description: "Navigate through an AI decision tree",
      icon: "🌳",
      question: "If it's raining AND you have an umbrella, what should you do?",
      hint: "Think about the logical outcome of having protection from rain",
      answer: "go outside",
      explanation:
        "Since you have an umbrella, you can safely go outside even though it's raining.",
    },
    {
      id: 5,
      title: "Neural Network",
      description: "Solve a simple neural network pattern",
      icon: "🧠",
      question: "Input: [1,0,1] → Hidden: [1,1] → Output: ?",
      hint: "Look for patterns in the input and hidden layers",
      answer: "1",
      explanation:
        "The pattern shows that when input has two 1s, the output is 1.",
    },
  ];

  const checkAnswer = () => {
    const currentPuzzleData = puzzles[currentPuzzle];
    const isCorrect =
      userSolution.toLowerCase().trim() ===
      currentPuzzleData.answer.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      if (currentPuzzle < puzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzle(currentPuzzle + 1);
          setUserSolution("");
          setShowHint(false);
        }, 2000);
      } else {
        setGameCompleted(true);
      }
    }
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setUserSolution("");
    setScore(0);
    setShowHint(false);
    setGameCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / puzzles.length) * 100;
    if (percentage >= 90)
      return "AI Master! You're a pattern recognition expert! 🤖✨";
    if (percentage >= 80)
      return "Excellent! You have great AI reasoning skills! 🧠🎉";
    if (percentage >= 70)
      return "Good job! You understand AI concepts well! 👍";
    if (percentage >= 50) return "Not bad! Keep practicing AI logic! 💪";
    return "Keep learning! AI takes practice! 📚";
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Puzzle Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">{getScoreMessage()}</p>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 mb-6 text-white">
              <div className="text-4xl font-bold mb-2">
                {score}/{puzzles.length}
              </div>
              <div className="text-2xl font-bold">
                {Math.round((score / puzzles.length) * 100)}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate("/games")}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPuzzleData = puzzles[currentPuzzle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/games")}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to AI Games
          </button>
        </div>

        {/* Game Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{currentPuzzleData.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentPuzzleData.title}
              </h1>
              <p className="text-gray-600">{currentPuzzleData.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentPuzzle + 1) / puzzles.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Puzzle {currentPuzzle + 1} of {puzzles.length} | Score: {score}
          </p>
        </div>

        {/* Puzzle Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Brain className="mr-2" size={20} />
            Puzzle Question
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {currentPuzzleData.question}
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
              onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
            />

            <div className="flex space-x-4">
              <button
                onClick={checkAnswer}
                className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Submit Answer
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </div>
          </div>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">💡 Hint</h3>
            <p className="text-blue-700">{currentPuzzleData.hint}</p>
          </div>
        )}

        {/* Explanation */}
        {userSolution.toLowerCase().trim() ===
          currentPuzzleData.answer.toLowerCase() && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="text-green-600 mr-2" size={20} />
              <h3 className="text-lg font-bold text-green-800">Correct!</h3>
            </div>
            <p className="text-green-700">{currentPuzzleData.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPuzzleGame;
