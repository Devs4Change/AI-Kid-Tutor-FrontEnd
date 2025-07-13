import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Code, Play, CheckCircle } from "lucide-react";

const PracticeCodingPage = () => {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const exercises = [
    {
      id: 1,
      title: "Hello World",
      description: "Write your first program to print a message",
      difficulty: "Beginner",
      icon: "👋",
      instructions: "Write code to print 'Hello, World!' to the console",
      starterCode: `// Write your code here
console.log("Hello, World!");`,
      solution: `console.log("Hello, World!");`,
      testCases: [{ input: "", expected: "Hello, World!" }],
    },
    {
      id: 2,
      title: "Variables",
      description: "Learn how to store and use data",
      difficulty: "Beginner",
      icon: "📦",
      instructions:
        "Create a variable called 'name' with your name and print 'Hello, [your name]!'",
      starterCode: `// Create a variable for your name
let name = "Your Name";

// Print a greeting
console.log("Hello, " + name + "!");`,
      solution: `let name = "Your Name";
console.log("Hello, " + name + "!");`,
      testCases: [
        { input: "Alice", expected: "Hello, Alice!" },
        { input: "Bob", expected: "Hello, Bob!" },
      ],
    },
    {
      id: 3,
      title: "Simple Calculator",
      description: "Create a basic calculator",
      difficulty: "Intermediate",
      icon: "🧮",
      instructions:
        "Create a function that adds two numbers and returns the result",
      starterCode: `// Create a function to add two numbers
function add(a, b) {
  // Write your code here
}

// Test your function
console.log(add(5, 3));`,
      solution: `function add(a, b) {
  return a + b;
}

console.log(add(5, 3));`,
      testCases: [
        { input: [5, 3], expected: 8 },
        { input: [10, 20], expected: 30 },
      ],
    },
    {
      id: 4,
      title: "Loop Practice",
      description: "Learn about loops and repetition",
      difficulty: "Intermediate",
      icon: "🔄",
      instructions: "Write a loop that prints numbers from 1 to 5",
      starterCode: `// Write a loop to print numbers 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
      solution: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
      testCases: [{ input: "", expected: "1\n2\n3\n4\n5" }],
    },
  ];

  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    setUserCode(exercise.starterCode);
    setOutput("");
    setShowSolution(false);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("");

    try {
      // Create a safe execution environment
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      // Execute the code
      eval(userCode);

      // Restore console.log
      console.log = originalLog;

      setOutput(logs.join("\n"));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const checkSolution = () => {
    setShowSolution(true);
  };

  const resetExercise = () => {
    setCurrentExercise(null);
    setUserCode("");
    setOutput("");
    setShowSolution(false);
  };

  if (currentExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={resetExercise}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Coding Exercises
            </button>
          </div>

          {/* Exercise Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{currentExercise.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentExercise.title}
                </h1>
                <p className="text-gray-600">{currentExercise.description}</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    currentExercise.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentExercise.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="mr-2" size={20} />
                Instructions
              </h2>
              <p className="text-gray-700 mb-4">
                {currentExercise.instructions}
              </p>

              {showSolution && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="mr-2" size={16} />
                    Solution
                  </h3>
                  <pre className="text-sm text-green-700 bg-green-100 p-3 rounded overflow-x-auto">
                    {currentExercise.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Code className="mr-2" size={20} />
                  Code Editor
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Play className="mr-2" size={16} />
                    {isRunning ? "Running..." : "Run Code"}
                  </button>
                  <button
                    onClick={checkSolution}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Show Solution
                  </button>
                </div>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Write your code here..."
              />
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Output</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {output}
              </pre>
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
              <Code className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Simple Coding
              </h1>
              <p className="text-gray-600">
                Learn basic programming concepts with interactive exercises
              </p>
            </div>
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startExercise(exercise)}
            >
              <div className="text-4xl mb-4">{exercise.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {exercise.title}
              </h3>
              <p className="text-gray-600 mb-4">{exercise.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {exercise.difficulty}
                </span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Start Exercise
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeCodingPage;
