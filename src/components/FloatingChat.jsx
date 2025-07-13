import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageCircle, Brain, AlertCircle } from "lucide-react";
import {
  generateGeminiResponse,
  isGeminiConfigured as checkGeminiConfigured,
} from "../services/gemini";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your AI learning assistant. Need help with your courses? Just ask! 🤖✨",
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
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-20 right-6 z-50 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          ) : (
            <MessageCircle
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          )}
        </button>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
          AI Assistant
          {/* Tooltip arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isGeminiAvailable ? "bg-green-400" : "bg-yellow-400"
                      }`}
                    ></div>
                    <span>
                      {isGeminiAvailable ? "Gemini AI Online" : "Basic Mode"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "ai" && (
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full mt-0.5">
                        <Brain size={10} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
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
                <div className="bg-gray-100 text-gray-800 max-w-[80%] px-3 py-2 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
                      <Brain size={10} className="text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
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
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="1"
                  style={{ minHeight: "36px", maxHeight: "80px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1">
              {["Help with course", "What is AI?", "Coding help"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
