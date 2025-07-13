import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map, Brain, Zap, Star } from "lucide-react";

const AIAdventureGame = () => {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [playerChoice, setPlayerChoice] = useState("");
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  const adventureScenes = [
    {
      id: 1,
      title: "The AI Laboratory",
      description:
        "You find yourself in a mysterious AI laboratory. There are three doors ahead of you, each with different symbols: 🧠 (Neural Networks), ⚡ (Machine Learning), and 🤖 (Robotics).",
      icon: "🏛️",
      choices: [
        {
          text: "Enter the Neural Network door 🧠",
          outcome: "You learn about how AI brains work! +10 points",
          points: 10,
          item: "Neural Network Knowledge",
          nextScene: 1,
        },
        {
          text: "Enter the Machine Learning door ⚡",
          outcome: "You discover how AI learns from data! +10 points",
          points: 10,
          item: "Machine Learning Knowledge",
          nextScene: 2,
        },
        {
          text: "Enter the Robotics door 🤖",
          outcome: "You explore how AI controls robots! +10 points",
          points: 10,
          item: "Robotics Knowledge",
          nextScene: 3,
        },
      ],
    },
    {
      id: 2,
      title: "Neural Network Chamber",
      description:
        "Inside, you see a glowing network of connections. The AI explains: 'I work like your brain - I have neurons that connect and share information to solve problems.'",
      icon: "🧠",
      choices: [
        {
          text: "Ask how neurons work",
          outcome:
            "The AI shows you how neurons process information! +15 points",
          points: 15,
          item: "Neuron Understanding",
          nextScene: 4,
        },
        {
          text: "Try to connect some neurons yourself",
          outcome: "You successfully create a simple pattern! +20 points",
          points: 20,
          item: "Pattern Recognition Skill",
          nextScene: 4,
        },
      ],
    },
    {
      id: 3,
      title: "Machine Learning Workshop",
      description:
        "You see the AI analyzing thousands of pictures. 'I learn by finding patterns in data,' it explains. 'The more examples I see, the better I get!'",
      icon: "⚡",
      choices: [
        {
          text: "Help the AI classify images",
          outcome:
            "You help the AI learn to recognize cats and dogs! +15 points",
          points: 15,
          item: "Image Classification Skill",
          nextScene: 4,
        },
        {
          text: "Ask about different learning types",
          outcome:
            "You learn about supervised and unsupervised learning! +15 points",
          points: 15,
          item: "Learning Types Knowledge",
          nextScene: 4,
        },
      ],
    },
    {
      id: 4,
      title: "Robotics Control Center",
      description:
        "You see robots moving around, controlled by AI. 'I can control robots to do tasks,' the AI says. 'I use sensors to understand the world around me.'",
      icon: "🤖",
      choices: [
        {
          text: "Program a robot to move",
          outcome: "You successfully program a robot to navigate! +20 points",
          points: 20,
          item: "Robot Programming Skill",
          nextScene: 5,
        },
        {
          text: "Learn about robot sensors",
          outcome: "You understand how robots see and feel! +15 points",
          points: 15,
          item: "Sensor Knowledge",
          nextScene: 5,
        },
      ],
    },
    {
      id: 5,
      title: "The AI Ethics Chamber",
      description:
        "You reach a special room where the AI teaches about responsibility. 'AI must be used for good,' it says. 'We need to be fair, safe, and helpful to humans.'",
      icon: "⚖️",
      choices: [
        {
          text: "Learn about AI safety",
          outcome: "You understand the importance of safe AI! +25 points",
          points: 25,
          item: "AI Safety Knowledge",
          nextScene: 6,
        },
        {
          text: "Discuss AI fairness",
          outcome: "You learn about treating everyone equally! +25 points",
          points: 25,
          item: "AI Fairness Understanding",
          nextScene: 6,
        },
      ],
    },
    {
      id: 6,
      title: "The AI Master's Test",
      description:
        "The AI presents you with a final challenge: 'Show me what you've learned about AI. Choose the best way to solve a problem using AI.'",
      icon: "🎯",
      choices: [
        {
          text: "Use pattern recognition to solve a puzzle",
          outcome: "Perfect! You understand AI's core strength! +30 points",
          points: 30,
          item: "AI Master Badge",
          nextScene: 7,
        },
        {
          text: "Apply machine learning to help people",
          outcome: "Excellent! You know how to use AI for good! +30 points",
          points: 30,
          item: "AI Master Badge",
          nextScene: 7,
        },
      ],
    },
    {
      id: 7,
      title: "Adventure Complete!",
      description:
        "Congratulations! You've successfully completed your AI adventure and learned about artificial intelligence!",
      icon: "🏆",
      choices: [],
    },
  ];

  const makeChoice = (choice) => {
    setPlayerChoice(choice.text);
    setScore(score + choice.points);

    if (choice.item) {
      setInventory([...inventory, choice.item]);
    }

    if (choice.nextScene < adventureScenes.length) {
      setTimeout(() => {
        setCurrentScene(choice.nextScene);
        setPlayerChoice("");
      }, 2000);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentScene(0);
    setPlayerChoice("");
    setScore(0);
    setInventory([]);
    setGameCompleted(false);
  };

  const getScoreMessage = () => {
    if (score >= 100)
      return "AI Master! You're an expert in artificial intelligence! 🤖✨";
    if (score >= 80)
      return "Excellent! You have a deep understanding of AI! 🧠🎉";
    if (score >= 60) return "Great job! You know a lot about AI! 👍";
    if (score >= 40) return "Good effort! You're learning AI well! 💪";
    return "Keep exploring! AI is fascinating! 📚";
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Adventure Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">{getScoreMessage()}</p>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 mb-6 text-white">
              <div className="text-4xl font-bold mb-2">{score} Points</div>
              <div className="text-2xl font-bold">AI Explorer</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your AI Knowledge:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {inventory.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Star className="text-yellow-500 mr-2" size={16} />
                    {item}
                  </div>
                ))}
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

  const currentSceneData = adventureScenes[currentScene];

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentSceneData.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentSceneData.title}
                </h1>
                <p className="text-gray-600">
                  AI Adventure - Scene {currentScene + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-500">Points</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentScene + 1) / adventureScenes.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Scene Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Map className="mr-2" size={20} />
            Your Adventure
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {currentSceneData.description}
          </p>

          {/* Choice Outcome */}
          {playerChoice && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <Zap className="text-green-600 mr-2" size={20} />
                <h3 className="font-bold text-green-800">Choice Made!</h3>
              </div>
              <p className="text-green-700">{playerChoice}</p>
            </div>
          )}

          {/* Choices */}
          {currentSceneData.choices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                What would you like to do?
              </h3>
              {currentSceneData.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(choice)}
                  disabled={playerChoice !== ""}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    playerChoice !== ""
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100"
                  }`}
                >
                  <div className="font-medium text-gray-800">{choice.text}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    +{choice.points} points
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inventory */}
        {inventory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="mr-2" size={20} />
              Your AI Knowledge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {inventory.map((item, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <Star className="text-yellow-500 mr-2" size={16} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdventureGame;
