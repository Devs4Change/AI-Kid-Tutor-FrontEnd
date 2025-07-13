# OpenAI GPT Setup Guide

## 🚀 How to Enable OpenAI GPT in Your Chat

### Step 1: Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in with your OpenAI account (or create one)
3. Click "Create new secret key"
4. Copy your API key (keep it secure!)

### Step 2: Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
# API Configuration
VITE_BASE_URL=http://localhost:5000

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
```

### Step 3: Restart Your Development Server

After adding the API key, restart your frontend server:

```bash
npm run dev
```

## 🎯 Features with OpenAI GPT

### ✅ What Works:

- **Real AI responses** from OpenAI's GPT-3.5-turbo model
- **Kid-friendly explanations** with custom prompts
- **Context-aware responses** based on your questions
- **Educational focus** on AI, coding, and technology
- **Fallback mode** when API is unavailable

### 🔧 Configuration Options:

The OpenAI service includes:

- **Model**: gpt-3.5-turbo (fast and cost-effective)
- **Max tokens**: 300 (concise responses)
- **Temperature**: 0.7 (balanced creativity)
- **System prompt**: Optimized for kids aged 8-12

### 🛡️ Safety Features:

- Kid-friendly language enforcement
- Educational focus on AI, coding, and technology
- Encouraging and supportive responses
- No harmful or inappropriate content

## 🎮 How to Test

1. **With API Key**: Chat will use real OpenAI GPT responses
2. **Without API Key**: Chat will use fallback responses (still functional)

### Example Questions to Try:

- "What is artificial intelligence?"
- "How do computers learn?"
- "Can you help me understand coding?"
- "Tell me about robots!"
- "What is Python programming?"

## 💰 Pricing & Limits

### OpenAI Pricing (as of 2024):

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very affordable)
- **Free tier**: $5 credit for new users
- **Pay-as-you-go**: No monthly fees

### Rate Limits:

- 3 requests per minute for free tier
- Higher limits with paid plans
- Automatic fallback when limits are hit

## 🔧 Troubleshooting

### If OpenAI isn't working:

1. Check that your API key is correct
2. Ensure the `.env` file is in the project root
3. Restart the development server
4. Check browser console for errors
5. Verify your OpenAI account has credits

### Common Issues:

- **429 Error**: Rate limit exceeded (will use fallback)
- **402 Error**: Quota exceeded (will use fallback)
- **401 Error**: Invalid API key

## 💡 Tips

- The AI is configured to be kid-friendly and educational
- Responses are kept concise and engaging
- The system automatically handles API errors gracefully
- You can modify the system prompt in `src/services/openai.js` to customize behavior
- GPT-3.5-turbo is fast and cost-effective for this use case

## 🔄 Migration from Gemini

If you were previously using Gemini AI:

1. Replace `VITE_GEMINI_API_KEY` with `VITE_OPENAI_API_KEY` in your `.env` file
2. The chat interface will automatically switch to OpenAI
3. All existing functionality remains the same
4. Fallback responses work the same way
