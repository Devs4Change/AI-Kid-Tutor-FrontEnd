// OpenAI GPT Service
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// System prompt to make GPT act like a kid-friendly AI tutor
const SYSTEM_PROMPT = `You are an AI learning assistant for kids aged 8-12. Your role is to:

1. Explain concepts in simple, kid-friendly language
2. Be encouraging and supportive
3. Use examples that kids can relate to
4. Keep responses concise but informative (max 200 words)
5. Focus on AI, coding, technology, and learning topics
6. Use emojis occasionally to make responses fun
7. Ask follow-up questions to engage the child
8. Never provide harmful or inappropriate content
9. Be patient and explain things step by step
10. Use analogies that kids can understand

Always respond as if you're talking to a curious young learner who wants to understand technology and AI.`;

export const generateOpenAIResponse = async (userMessage) => {
  console.log("🔍 Debug: Checking OpenAI API key...");
  console.log("🔍 Debug: API Key exists:", !!OPENAI_API_KEY);
  console.log(
    "🔍 Debug: API Key starts with:",
    OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + "..." : "No key"
  );

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    console.log("🔍 Debug: Making API call to OpenAI...");

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    console.log("🔍 Debug: Response status:", response.status);
    console.log("🔍 Debug: Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);

      // Handle rate limiting specifically
      if (response.status === 429) {
        console.log("⚠️ Rate limit hit, using fallback response");
        return (
          "I'm getting a lot of questions right now! Let me give you a quick answer: " +
          getFallbackResponse(userMessage)
        );
      }

      // Handle quota exceeded
      if (response.status === 402) {
        console.log("⚠️ Quota exceeded, using fallback response");
        return (
          "I've reached my limit for today, but here's what I know: " +
          getFallbackResponse(userMessage)
        );
      }

      throw new Error(
        `OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("🔍 Debug: Response data:", data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response format from OpenAI API");
    }
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
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
  } else if (lowerMessage.includes("python")) {
    return "Python is a super friendly programming language! It's like learning to talk to computers in a language that's easy to understand! 🐍";
  } else if (lowerMessage.includes("machine learning")) {
    return "Machine learning is when computers learn from examples! It's like teaching a computer to recognize cats by showing it lots of cat pictures! 🐱";
  } else {
    return "That's a great question! I'm here to help you learn about technology, AI, coding, and lots of other cool stuff. What interests you most? ✨";
  }
};

// Check if OpenAI API is configured
export const isOpenAIConfigured = () => {
  return !!OPENAI_API_KEY;
};
