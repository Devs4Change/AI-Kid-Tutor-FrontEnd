// Gemini AI Service
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// System prompt to make Gemini act like a kid-friendly AI tutor
const SYSTEM_PROMPT = `You are an AI learning assistant for kids aged 8-12. Your role is to:

1. Explain concepts in simple, kid-friendly language
2. Be encouraging and supportive
3. Use examples that kids can relate to
4. Keep responses concise but informative
5. Focus on AI, coding, technology, and learning topics
6. Use emojis occasionally to make responses fun
7. Ask follow-up questions to engage the child
8. Never provide harmful or inappropriate content

Always respond as if you're talking to a curious young learner who wants to understand technology and AI.`;

export const generateGeminiResponse = async (userMessage) => {
  console.log("🔍 Debug: Checking Gemini API key...");
  console.log("🔍 Debug: API Key exists:", !!GEMINI_API_KEY);
  console.log(
    "🔍 Debug: API Key starts with:",
    GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + "..." : "No key"
  );

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  try {
    console.log("🔍 Debug: Making API call to:", GEMINI_API_URL);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    console.log("🔍 Debug: Response status:", response.status);
    console.log("🔍 Debug: Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);

      // Handle rate limiting specifically
      if (response.status === 429) {
        console.log("⚠️ Rate limit hit, using fallback response");
        return (
          "I'm getting a lot of questions right now! Let me give you a quick answer: " +
          getFallbackResponse(userMessage)
        );
      }

      throw new Error(
        `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("🔍 Debug: Response data:", data);

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    console.error("❌ Error details:", error.message);

    // Fallback responses if API fails
    const fallbackResponses = [
      "I'm having trouble connecting right now, but I'd love to help you learn! Can you try asking your question again? 🤖",
      "Oops! Something went wrong with my connection. Let me try to answer your question: " +
        getFallbackResponse(userMessage),
      "I'm a bit busy right now, but here's what I know: " +
        getFallbackResponse(userMessage),
    ];

    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  }
};

// Fallback response generator for when API is unavailable
const getFallbackResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("ai") ||
    lowerMessage.includes("artificial intelligence")
  ) {
    return "AI stands for Artificial Intelligence! It's like giving computers a brain so they can think and learn like humans do. Pretty cool, right? 🤖";
  } else if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("programming")
  ) {
    return "Coding is like writing instructions for computers! It's how we tell them what to do. Think of it like giving your computer a recipe to follow! 💻";
  } else if (lowerMessage.includes("robot")) {
    return "Robots are machines that can do tasks automatically! Some robots use AI to make decisions, just like how you decide what to do! 🤖";
  } else if (lowerMessage.includes("help") || lowerMessage.includes("lesson")) {
    return "I'm here to help you with your lessons! What specific topic are you learning about? I'd love to explain it in a fun way! 📚";
  } else {
    return "That's a great question! I'm here to help you learn about technology, AI, coding, and lots of other cool stuff. What interests you most? ✨";
  }
};

// Check if Gemini API is configured
export const isGeminiConfigured = () => {
  return !!GEMINI_API_KEY;
};
