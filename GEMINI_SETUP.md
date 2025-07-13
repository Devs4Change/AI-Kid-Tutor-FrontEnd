# Gemini AI Setup Guide

## 🚀 How to Enable Gemini AI in Your Chat

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
# API Configuration
VITE_BASE_URL=http://localhost:5000

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Restart Your Development Server

After adding the API key, restart your frontend server:

```bash
npm run dev
```

## 🎯 Features with Gemini AI

### ✅ What Works:

- **Real AI responses** from Google's Gemini model
- **Kid-friendly explanations** with custom prompts
- **Context-aware responses** based on your questions
- **Safety filters** to ensure appropriate content
- **Fallback mode** when API is unavailable

### 🔧 Configuration Options:

The Gemini service includes:

- **Temperature**: 0.7 (balanced creativity)
- **Max tokens**: 500 (concise responses)
- **Safety settings**: Medium+ blocking for inappropriate content
- **System prompt**: Optimized for kids aged 8-12

### 🛡️ Safety Features:

- Content filtering for harassment, hate speech, etc.
- Kid-friendly language enforcement
- Educational focus on AI, coding, and technology
- Encouraging and supportive responses

## 🎮 How to Test

1. **With API Key**: Chat will use real Gemini AI responses
2. **Without API Key**: Chat will use fallback responses (still functional)

### Example Questions to Try:

- "What is artificial intelligence?"
- "How do computers learn?"
- "Can you help me understand coding?"
- "Tell me about robots!"

## 🔧 Troubleshooting

### If Gemini isn't working:

1. Check that your API key is correct
2. Ensure the `.env` file is in the project root
3. Restart the development server
4. Check browser console for errors

### Rate Limits:

- Gemini has generous free tier limits
- If you hit limits, the chat will fall back to basic responses

## 💡 Tips

- The AI is configured to be kid-friendly and educational
- Responses are kept concise and engaging
- The system automatically handles API errors gracefully
- You can modify the system prompt in `src/services/gemini.js` to customize behavior
