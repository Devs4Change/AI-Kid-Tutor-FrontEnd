// Free AI Service - Using a simple text generation approach
// This service provides intelligent responses without requiring API keys or authentication

// Enhanced response generator with more variety and intelligence
const generateFreeAIResponse = async (userMessage) => {
  console.log("🔍 Debug: Using Free AI for response");

  // Add a small delay to simulate AI thinking
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  return getIntelligentResponse(userMessage);
};

// Intelligent response generator
const getIntelligentResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  // AI and Technology responses
  if (
    lowerMessage.includes("ai") ||
    lowerMessage.includes("artificial intelligence")
  ) {
    const responses = [
      "AI stands for Artificial Intelligence! It's like giving computers a brain so they can think and learn like humans do. Think of it like teaching a computer to solve puzzles! 🤖✨",
      "Artificial Intelligence is super cool! It's when we make computers smart enough to do things that usually need human thinking. Like recognizing pictures, understanding speech, or playing games! 🧠💻",
      "AI is like having a really smart friend who's a computer! It can learn from examples, make decisions, and help us solve problems. Pretty amazing, right? 🤖🌟",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Coding responses
  if (lowerMessage.includes("code") || lowerMessage.includes("programming")) {
    const responses = [
      "Coding is like writing instructions for computers! It's how we tell them what to do. Think of it like giving your computer a recipe to follow! 💻📝",
      "Programming is super fun! It's like being a computer wizard who can make machines do amazing things. You write special words (code) and the computer follows your commands! 🧙‍♂️✨",
      "Coding is like learning a new language - but for computers! You write instructions in a way the computer understands, and it does exactly what you tell it to do! 💻🎯",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Python responses
  if (lowerMessage.includes("python")) {
    const responses = [
      "Python is a super friendly programming language! It's like learning to talk to computers in a language that's easy to understand. It's named after a snake, but it's much friendlier! 🐍💻",
      "Python is perfect for beginners! It's like having training wheels for coding. The code looks almost like regular English, so it's easy to read and write! 🐍📚",
      "Python is awesome! It's used to make websites, games, apps, and even AI! It's like a Swiss Army knife for programming - you can do almost anything with it! 🐍🔧",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Machine Learning responses
  if (
    lowerMessage.includes("machine learning") ||
    lowerMessage.includes("ml")
  ) {
    const responses = [
      "Machine learning is when computers learn from examples! It's like teaching a computer to recognize cats by showing it lots of cat pictures. The more examples it sees, the better it gets! 🐱🤖",
      "Machine learning is super cool! It's like giving a computer a brain that can learn and improve over time. Just like how you get better at games the more you play! 🧠🎮",
      "ML is like having a computer that learns from experience! Instead of following strict rules, it figures out patterns and makes smart guesses. It's like having a really smart student! 📚🎯",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Robot responses
  if (lowerMessage.includes("robot")) {
    const responses = [
      "Robots are machines that can do tasks automatically! Some robots use AI to make decisions, just like how you decide what to do! 🤖⚡",
      "Robots are like mechanical helpers! They can do jobs that are too dangerous, boring, or difficult for humans. Some even look like humans, while others look like machines! 🤖🛠️",
      "Robots are super cool! They can be as small as a toy car or as big as a car factory. Some robots help doctors, some explore space, and some even clean your house! 🤖🏠",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Help and Learning responses
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("lesson") ||
    lowerMessage.includes("learn")
  ) {
    const responses = [
      "I'm here to help you with your lessons! What specific topic are you learning about? I'd love to explain it in a fun way! 📚✨",
      "Learning is an adventure! What subject are you working on? I can help break down complex ideas into simple, fun explanations! 🎓🌟",
      "I love helping students learn! Tell me what you're studying and I'll make it super easy to understand. No question is too small! 📖💡",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // General questions
  if (
    lowerMessage.includes("what") ||
    lowerMessage.includes("how") ||
    lowerMessage.includes("why")
  ) {
    const responses = [
      "That's a great question! I'm here to help you learn about technology, AI, coding, and lots of other cool stuff. What interests you most? ✨🤔",
      "I love curious minds! I can help you understand computers, programming, artificial intelligence, and so much more. What would you like to explore? 🌟🔍",
      "Excellent question! I'm your AI learning buddy, and I'm here to make learning fun and easy. What topic would you like to dive into? 📚🎯",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default responses
  const defaultResponses = [
    "That's an interesting question! I'm here to help you learn about technology, AI, coding, and lots of other cool stuff. What interests you most? ✨",
    "I love your enthusiasm for learning! I can help you understand computers, programming, artificial intelligence, and so much more. What would you like to explore? 🌟",
    "Great thinking! I'm your AI learning assistant, and I'm here to make learning fun and easy. What topic would you like to dive into? 📚",
    "I'm excited to help you learn! I know a lot about technology, coding, AI, and many other fascinating subjects. What would you like to know more about? 🚀",
    "You're asking great questions! I'm here to help you understand complex topics in simple, fun ways. What would you like to learn about today? 💡",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Check if Free AI is available (always true since it's built-in)
export const isFreeAIAvailable = () => {
  return true; // Free AI is always available
};

export { generateFreeAIResponse };
