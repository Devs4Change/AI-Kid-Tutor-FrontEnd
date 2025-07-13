import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw, Settings, Zap } from "lucide-react";

const RobotBuilderGame = () => {
  const navigate = useNavigate();
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [robotCode, setRobotCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [robotDirection, setRobotDirection] = useState(0); // 0: right, 1: down, 2: left, 3: up
  const [gameGrid, setGameGrid] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Move Forward",
      description: "Program your robot to move to the goal",
      grid: [
        ["🤖", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜", "🎯"],
      ],
      startPos: { x: 0, y: 0 },
      goalPos: { x: 3, y: 3 },
      solution: "move()\nmove()\nmove()\nmove()\nmove()\nmove()",
      hint: "Use move() to make the robot go forward",
    },
    {
      id: 2,
      title: "Turn and Move",
      description: "Navigate around obstacles to reach the goal",
      grid: [
        ["🤖", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬛", "⬜"],
        ["⬜", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜", "🎯"],
      ],
      startPos: { x: 0, y: 0 },
      goalPos: { x: 3, y: 3 },
      solution:
        "move()\nmove()\nturnRight()\nmove()\nturnLeft()\nmove()\nmove()",
      hint: "Use turnRight() and turnLeft() to change direction",
    },
    {
      id: 3,
      title: "Collect Items",
      description: "Collect all items before reaching the goal",
      grid: [
        ["🤖", "🍎", "⬜", "⬜"],
        ["⬜", "⬜", "🍎", "⬜"],
        ["⬜", "⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜", "🎯"],
      ],
      startPos: { x: 0, y: 0 },
      goalPos: { x: 3, y: 3 },
      solution:
        "move()\ncollect()\nmove()\nmove()\ncollect()\nmove()\nmove()\nmove()",
      hint: "Use collect() to pick up items",
    },
  ];

  const robotCommands = {
    move: () => {
      const newPos = { ...robotPosition };
      switch (robotDirection) {
        case 0:
          newPos.x = Math.min(newPos.x + 1, 3);
          break; // right
        case 1:
          newPos.y = Math.min(newPos.y + 1, 3);
          break; // down
        case 2:
          newPos.x = Math.max(newPos.x - 1, 0);
          break; // left
        case 3:
          newPos.y = Math.max(newPos.y - 1, 0);
          break; // up
      }
      setRobotPosition(newPos);
    },
    turnRight: () => {
      setRobotDirection((prev) => (prev + 1) % 4);
    },
    turnLeft: () => {
      setRobotDirection((prev) => (prev + 3) % 4);
    },
    collect: () => {
      // Collect item logic would go here
    },
  };

  const startLevel = (level) => {
    setCurrentLevel(level);
    setRobotPosition(level.startPos);
    setRobotDirection(0);
    setGameGrid(level.grid);
    setRobotCode("");
    setLevelCompleted(false);
    setSelectedRobot(level);
  };

  const runRobotCode = async () => {
    if (!selectedRobot) return;

    setIsRunning(true);
    const commands = robotCode.split("\n").filter((cmd) => cmd.trim());

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim().toLowerCase();
      if (robotCommands[command]) {
        robotCommands[command]();
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for animation
      }
    }

    // Check if goal reached
    if (
      robotPosition.x === selectedRobot.goalPos.x &&
      robotPosition.y === selectedRobot.goalPos.y
    ) {
      setLevelCompleted(true);
    }

    setIsRunning(false);
  };

  const resetLevel = () => {
    if (selectedRobot) {
      setRobotPosition(selectedRobot.startPos);
      setRobotDirection(0);
      setGameGrid(selectedRobot.grid);
      setRobotCode("");
      setLevelCompleted(false);
    }
  };

  const getDirectionEmoji = () => {
    const directions = ["➡️", "⬇️", "⬅️", "⬆️"];
    return directions[robotDirection];
  };

  const renderGrid = () => {
    const grid = gameGrid.map((row) => [...row]);

    // Place robot at current position
    if (
      robotPosition.x >= 0 &&
      robotPosition.y >= 0 &&
      robotPosition.x < 4 &&
      robotPosition.y < 4
    ) {
      grid[robotPosition.y][robotPosition.x] = getDirectionEmoji();
    }

    return grid;
  };

  if (selectedRobot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedRobot(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Robot Builder
            </button>
          </div>

          {/* Level Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">🤖</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Level {selectedRobot.id}: {selectedRobot.title}
                </h1>
                <p className="text-gray-600">{selectedRobot.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Robot World
              </h2>
              <div className="grid grid-cols-4 gap-1 mb-4">
                {renderGrid().map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-16 h-16 border-2 border-gray-300 flex items-center justify-center text-2xl ${
                        cell === "⬛" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={runRobotCode}
                  disabled={isRunning || !robotCode.trim()}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Play className="mr-2" size={16} />
                  {isRunning ? "Running..." : "Run Code"}
                </button>
                <button
                  onClick={resetLevel}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="mr-2" size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Robot Code
              </h2>
              <textarea
                value={robotCode}
                onChange={(e) => setRobotCode(e.target.value)}
                placeholder="Write your robot commands here...
Available commands:
- move()
- turnRight()
- turnLeft()
- collect()"
                className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">💡 Hint</h3>
                <p className="text-blue-700">{selectedRobot.hint}</p>
              </div>
            </div>
          </div>

          {/* Level Complete */}
          {levelCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Level Complete!
                </h3>
                <p className="text-green-700 mb-4">
                  Great job programming your robot!
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      if (currentLevel < levels.length - 1) {
                        startLevel(levels[currentLevel + 1]);
                      } else {
                        setSelectedRobot(null);
                      }
                    }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {currentLevel < levels.length - 1
                      ? "Next Level"
                      : "Back to Menu"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
            onClick={() => navigate("/games")}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to AI Games
          </button>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Robot Builder
              </h1>
              <p className="text-gray-600">Build and program virtual robots</p>
            </div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startLevel(level)}
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Level {level.id}
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                {level.title}
              </h4>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Programming Challenge
                </span>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Start Level
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RobotBuilderGame;
