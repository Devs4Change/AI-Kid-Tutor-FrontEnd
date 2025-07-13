import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Brain, AlertCircle } from "lucide-react";
import {
  generateGeminiResponse,
  isGeminiConfigured as checkGeminiConfigured,
} from "../services/gemini";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI learning assistant. I can help you with questions about AI, coding, and your lessons. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if Gemini is configured on component mount
  useEffect(() => {
    const geminiAvailable = checkGeminiConfigured();
    console.log("🔍 Debug: Gemini configured:", geminiAvailable);
    setIsGeminiAvailable(geminiAvailable);
  }, []);

  // AI response generator
  const generateAIResponse = (userMessage) => {
    const responses = {
      ai: [
        "AI stands for Artificial Intelligence. It's technology that allows computers to think and learn like humans!",
        "Machine learning is a type of AI where computers learn from data to make predictions or decisions.",
        "Robots are machines that can perform tasks automatically. Some robots use AI to make decisions!",
        "Neural networks are like artificial brains that help computers learn patterns and solve problems.",
        "Deep learning is a type of machine learning that uses many layers to understand complex information.",
      ],
      coding: [
        "Coding is like giving instructions to a computer. It's how we tell computers what to do!",
        "Python is a great first programming language. It's easy to read and write!",
        "Variables are like boxes that store information in your code.",
        "Functions are reusable blocks of code that perform specific tasks.",
        "Loops help you repeat actions in your code without writing the same thing many times.",
      ],
      lessons: [
        "Great question! Let me help you understand that concept better.",
        "That's a common question. Here's a simple explanation...",
        "I'm here to help you with your lessons. What specific part are you having trouble with?",
        "Remember, learning takes time. Don't worry if something seems difficult at first!",
        "Would you like me to explain this in a different way?",
      ],
      general: [
        "That's an interesting question! Let me think about that...",
        "I'm here to help you learn and explore new ideas!",
        "Don't hesitate to ask more questions. Learning is all about curiosity!",
        "Great thinking! That shows you're really engaging with the material.",
        "I love your enthusiasm for learning!",
      ],
    };

    const lowerMessage = userMessage.toLowerCase();
    let category = "general";

    if (
      lowerMessage.includes("ai") ||
      lowerMessage.includes("artificial intelligence") ||
      lowerMessage.includes("machine learning") ||
      lowerMessage.includes("neural") ||
      lowerMessage.includes("robot")
    ) {
      category = "ai";
    } else if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("programming") ||
      lowerMessage.includes("python") ||
      lowerMessage.includes("variable") ||
      lowerMessage.includes("function")
    ) {
      category = "coding";
    } else if (
      lowerMessage.includes("lesson") ||
      lowerMessage.includes("learn") ||
      lowerMessage.includes("understand") ||
      lowerMessage.includes("help")
    ) {
      category = "lessons";
    }

    const categoryResponses = responses[category];
    const randomResponse =
      categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    return randomResponse;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let aiResponseContent;

      if (isGeminiAvailable) {
        // Use Gemini AI
        console.log("🔍 Debug: Using Gemini AI for response");
        aiResponseContent = await generateGeminiResponse(inputMessage);
      } else {
        console.log("🔍 Debug: Using fallback responses");
        // Use fallback responses
        aiResponseContent = generateAIResponse(inputMessage);
        // Add a small delay to simulate thinking
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Show error message to user
      const errorResponse = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "I'm having trouble connecting right now. Let me try to help you with a simple answer: " +
          generateAIResponse(inputMessage),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  AI Assistant
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Your personal learning companion
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:ml-auto flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-500">
              <div
                className={`w-2 h-2 rounded-full ${
                  isGeminiAvailable ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></div>
              <span className="hidden sm:inline">
                {isGeminiAvailable ? "Gemini AI Online" : "Basic Mode"}
              </span>
              <span className="sm:hidden">
                {isGeminiAvailable ? "AI Online" : "Basic"}
              </span>
              {!isGeminiAvailable && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <AlertCircle size={12} className="sm:w-3 sm:h-3" />
                  <span className="text-xs hidden sm:inline">
                    API Key Needed
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-64 sm:h-80 md:h-96 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "ai" && (
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full mt-1">
                        <Brain size={12} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 sm:mt-2 ${
                          message.type === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
                      <Brain size={12} className="text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <div className="flex items-end space-x-2 sm:space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about AI, coding, or your lessons..."
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows="1"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 sm:p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
              {[
                "What is AI?",
                "How does coding work?",
                "Help with my lesson",
                "Tell me about robots",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center">
            <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Sparkles
                className="text-blue-600"
                size={20}
                className="sm:w-6 sm:h-6"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
              Smart Learning
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Get personalized help with your lessons
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center">
            <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Brain
                className="text-purple-600"
                size={20}
                className="sm:w-6 sm:h-6"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
              AI Knowledge
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Learn about artificial intelligence
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center sm:col-span-2 md:col-span-1">
            <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Bot
                className="text-green-600"
                size={20}
                className="sm:w-6 sm:h-6"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
              24/7 Available
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Ask questions anytime, anywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
