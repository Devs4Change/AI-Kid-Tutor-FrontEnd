// Hugging Face AI Service
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/";

// Using a free model that doesn't require authentication
const MODEL_NAME = "gpt2";

// System prompt to make the AI act like a kid-friendly tutor
const SYSTEM_PROMPT = `You are an AI learning assistant for kids aged 8-12. Your role is to:

1. Explain concepts in simple, kid-friendly language
2. Be encouraging and supportive
3. Use examples that kids can relate to
4. Keep responses concise but informative (max 150 words)
5. Focus on AI, coding, technology, and learning topics
6. Use emojis occasionally to make responses fun
7. Ask follow-up questions to engage the child
8. Never provide harmful or inappropriate content
9. Be patient and explain things step by step
10. Use analogies that kids can understand

Always respond as if you're talking to a curious young learner who wants to understand technology and AI.`;

export const generateHuggingFaceResponse = async (userMessage) => {
  console.log("🔍 Debug: Making API call to Hugging Face...");
  console.log("🔍 Debug: Using model:", MODEL_NAME);

  try {
    console.log("🔍 Debug: Sending request to Hugging Face...");

    const response = await fetch(`${HUGGINGFACE_API_URL}${MODEL_NAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    console.log("🔍 Debug: Response status:", response.status);
    console.log("🔍 Debug: Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Hugging Face API Error:", errorData);

      // Handle model loading (first request might take time)
      if (response.status === 503) {
        console.log("⚠️ Model is loading, using fallback response");
        return (
          "I'm just waking up! Let me give you a quick answer: " +
          getFallbackResponse(userMessage)
        );
      }

      throw new Error(
        `Hugging Face API error: ${response.status} - ${JSON.stringify(
          errorData
        )}`
      );
    }

    const data = await response.json();
    console.log("🔍 Debug: Response data:", data);

    if (data && data[0] && data[0].generated_text) {
      let responseText = data[0].generated_text.trim();

      // Clean up the response
      responseText = responseText.replace(/^Assistant:\s*/i, "");
      responseText = responseText.replace(/^User:\s*/i, "");

      // If response is too long, truncate it
      if (responseText.length > 300) {
        responseText = responseText.substring(0, 300) + "...";
      }

      return responseText || getFallbackResponse(userMessage);
    } else {
      throw new Error("Invalid response format from Hugging Face API");
    }
  } catch (error) {
    console.error("❌ Error calling Hugging Face API:", error);
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

// Check if Hugging Face is available (always true since it's free)
export const isHuggingFaceAvailable = () => {
  return true; // Hugging Face is always available (no API key needed)
};
