import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Rocket, Play, CheckCircle, Eye } from "lucide-react";

const PracticeProjectsPage = () => {
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Color Changer",
      description: "Create a simple color changing button",
      difficulty: "Beginner",
      icon: "🎨",
      steps: [
        {
          title: "Step 1: Create the HTML",
          content: `Create a simple HTML structure with a button and a display area:

\`\`\`html
<div id="app">
  <h1>Color Changer</h1>
  <button id="colorBtn">Change Color</button>
  <div id="colorDisplay" style="width: 200px; height: 200px; border: 2px solid #333; margin: 20px 0;"></div>
</div>
\`\`\``,
          code: `<div id="app">
  <h1>Color Changer</h1>
  <button id="colorBtn">Change Color</button>
  <div id="colorDisplay" style="width: 200px; height: 200px; border: 2px solid #333; margin: 20px 0;"></div>
</div>`,
        },
        {
          title: "Step 2: Add JavaScript",
          content: `Add JavaScript to make the button change colors:

\`\`\`javascript
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
const colorBtn = document.getElementById('colorBtn');
const colorDisplay = document.getElementById('colorDisplay');

colorBtn.addEventListener('click', () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  colorDisplay.style.backgroundColor = randomColor;
});
\`\`\``,
          code: `const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
const colorBtn = document.getElementById('colorBtn');
const colorDisplay = document.getElementById('colorDisplay');

colorBtn.addEventListener('click', () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  colorDisplay.style.backgroundColor = randomColor;
});`,
        },
        {
          title: "Step 3: Test Your Project",
          content: `Click the button to see the color change! Try adding more colors to the array or changing the size of the display area.`,
          code: `// Your project is ready! Click the button to see it in action.`,
        },
      ],
    },
    {
      id: 2,
      title: "Simple Calculator",
      description: "Build a basic calculator with HTML and JavaScript",
      difficulty: "Intermediate",
      icon: "🧮",
      steps: [
        {
          title: "Step 1: Create the Calculator Layout",
          content: `Create a calculator with buttons and display:

\`\`\`html
<div id="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button onclick="clearDisplay()">C</button>
    <button onclick="appendNumber('7')">7</button>
    <button onclick="appendNumber('8')">8</button>
    <button onclick="appendNumber('9')">9</button>
    <button onclick="setOperator('+')">+</button>
    <button onclick="appendNumber('4')">4</button>
    <button onclick="appendNumber('5')">5</button>
    <button onclick="appendNumber('6')">6</button>
    <button onclick="setOperator('-')">-</button>
    <button onclick="appendNumber('1')">1</button>
    <button onclick="appendNumber('2')">2</button>
    <button onclick="appendNumber('3')">3</button>
    <button onclick="setOperator('*')">×</button>
    <button onclick="appendNumber('0')">0</button>
    <button onclick="appendNumber('.')">.</button>
    <button onclick="calculate()">=</button>
    <button onclick="setOperator('/')">÷</button>
  </div>
</div>
\`\`\``,
          code: `<div id="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button onclick="clearDisplay()">C</button>
    <button onclick="appendNumber('7')">7</button>
    <button onclick="appendNumber('8')">8</button>
    <button onclick="appendNumber('9')">9</button>
    <button onclick="setOperator('+')">+</button>
    <button onclick="appendNumber('4')">4</button>
    <button onclick="appendNumber('5')">5</button>
    <button onclick="appendNumber('6')">6</button>
    <button onclick="setOperator('-')">-</button>
    <button onclick="appendNumber('1')">1</button>
    <button onclick="appendNumber('2')">2</button>
    <button onclick="appendNumber('3')">3</button>
    <button onclick="setOperator('*')">×</button>
    <button onclick="appendNumber('0')">0</button>
    <button onclick="appendNumber('.')">.</button>
    <button onclick="calculate()">=</button>
    <button onclick="setOperator('/')">÷</button>
  </div>
</div>`,
        },
        {
          title: "Step 2: Add JavaScript Functions",
          content: `Add the JavaScript functions to make the calculator work:

\`\`\`javascript
let displayValue = '';
let firstNumber = null;
let operator = null;

function appendNumber(num) {
  displayValue += num;
  document.getElementById('display').value = displayValue;
}

function setOperator(op) {
  if (displayValue !== '') {
    firstNumber = parseFloat(displayValue);
    operator = op;
    displayValue = '';
  }
}

function calculate() {
  if (firstNumber !== null && operator !== null && displayValue !== '') {
    const secondNumber = parseFloat(displayValue);
    let result;
    
    switch(operator) {
      case '+': result = firstNumber + secondNumber; break;
      case '-': result = firstNumber - secondNumber; break;
      case '*': result = firstNumber * secondNumber; break;
      case '/': result = firstNumber / secondNumber; break;
    }
    
    document.getElementById('display').value = result;
    displayValue = result.toString();
    firstNumber = null;
    operator = null;
  }
}

function clearDisplay() {
  displayValue = '';
  firstNumber = null;
  operator = null;
  document.getElementById('display').value = '';
}
\`\`\``,
          code: `let displayValue = '';
let firstNumber = null;
let operator = null;

function appendNumber(num) {
  displayValue += num;
  document.getElementById('display').value = displayValue;
}

function setOperator(op) {
  if (displayValue !== '') {
    firstNumber = parseFloat(displayValue);
    operator = op;
    displayValue = '';
  }
}

function calculate() {
  if (firstNumber !== null && operator !== null && displayValue !== '') {
    const secondNumber = parseFloat(displayValue);
    let result;
    
    switch(operator) {
      case '+': result = firstNumber + secondNumber; break;
      case '-': result = firstNumber - secondNumber; break;
      case '*': result = firstNumber * secondNumber; break;
      case '/': result = firstNumber / secondNumber; break;
    }
    
    document.getElementById('display').value = result;
    displayValue = result.toString();
    firstNumber = null;
    operator = null;
  }
}

function clearDisplay() {
  displayValue = '';
  firstNumber = null;
  operator = null;
  document.getElementById('display').value = '';
}`,
        },
        {
          title: "Step 3: Add Some CSS",
          content: `Add some basic styling to make it look like a calculator:

\`\`\`css
#calculator {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 10px;
  background: #f0f0f0;
}

#display {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  font-size: 20px;
  text-align: right;
  padding: 5px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.buttons button {
  padding: 15px;
  font-size: 18px;
  border: 1px solid #999;
  background: white;
  cursor: pointer;
}

.buttons button:hover {
  background: #e0e0e0;
}
\`\`\``,
          code: `#calculator {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 10px;
  background: #f0f0f0;
}

#display {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  font-size: 20px;
  text-align: right;
  padding: 5px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.buttons button {
  padding: 15px;
  font-size: 18px;
  border: 1px solid #999;
  background: white;
  cursor: pointer;
}

.buttons button:hover {
  background: #e0e0e0;
}`,
        },
      ],
    },
    {
      id: 3,
      title: "Todo List",
      description: "Create a simple todo list application",
      difficulty: "Intermediate",
      icon: "📝",
      steps: [
        {
          title: "Step 1: Create the HTML Structure",
          content: `Create a simple todo list interface:

\`\`\`html
<div id="todo-app">
  <h1>My Todo List</h1>
  <div class="input-section">
    <input type="text" id="todoInput" placeholder="Add a new task...">
    <button onclick="addTodo()">Add</button>
  </div>
  <ul id="todoList"></ul>
</div>
\`\`\``,
          code: `<div id="todo-app">
  <h1>My Todo List</h1>
  <div class="input-section">
    <input type="text" id="todoInput" placeholder="Add a new task...">
    <button onclick="addTodo()">Add</button>
  </div>
  <ul id="todoList"></ul>
</div>`,
        },
        {
          title: "Step 2: Add JavaScript Functionality",
          content: `Add the JavaScript to make the todo list work:

\`\`\`javascript
let todos = [];

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text !== '') {
    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    todos.push(todo);
    input.value = '';
    renderTodos();
  }
}

function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = \`
      <span onclick="toggleTodo(\${todo.id})">\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})">Delete</button>
    \`;
    todoList.appendChild(li);
  });
}
\`\`\``,
          code: `let todos = [];

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text !== '') {
    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    todos.push(todo);
    input.value = '';
    renderTodos();
  }
}

function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = \`
      <span onclick="toggleTodo(\${todo.id})">\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})">Delete</button>
    \`;
    todoList.appendChild(li);
  });
}`,
        },
        {
          title: "Step 3: Add CSS Styling",
          content: `Add some nice styling to make it look good:

\`\`\`css
#todo-app {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#todoInput {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

#todoList {
  list-style: none;
  padding: 0;
}

#todoList li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 5px;
}

.completed span {
  text-decoration: line-through;
  color: #6c757d;
}
\`\`\``,
          code: `#todo-app {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#todoInput {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

#todoList {
  list-style: none;
  padding: 0;
}

#todoList li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 5px;
}

.completed span {
  text-decoration: line-through;
  color: #6c757d;
}`,
        },
      ],
    },
  ];

  const startProject = (project) => {
    setCurrentProject(project);
    setCurrentStep(0);
    setShowPreview(false);
  };

  const nextStep = () => {
    if (currentStep < currentProject.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetProject = () => {
    setCurrentProject(null);
    setCurrentStep(0);
    setShowPreview(false);
  };

  if (currentProject) {
    const step = currentProject.steps[currentStep];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={resetProject}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Projects
            </button>
          </div>

          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{currentProject.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentProject.title}
                </h1>
                <p className="text-gray-600">{currentProject.description}</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    currentProject.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentProject.difficulty}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentStep + 1) / currentProject.steps.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep + 1} of {currentProject.steps.length}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="mr-2" size={20} />
                {step.title}
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{step.content}</p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === currentProject.steps.length - 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentStep === currentProject.steps.length - 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Rocket className="mr-2" size={20} />
                  Code
                </h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Eye className="mr-2" size={16} />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {step.code}
              </pre>
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
              <Rocket className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mini Projects
              </h1>
              <p className="text-gray-600">
                Build small AI projects step by step
              </p>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startProject(project)}
            >
              <div className="text-4xl mb-4">{project.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.difficulty}
                </span>
                <span className="text-sm text-gray-500">
                  {project.steps.length} steps
                </span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Start Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeProjectsPage;
