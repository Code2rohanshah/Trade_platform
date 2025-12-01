import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('🔑 API Key loaded:', API_KEY ? 'YES ✅' : 'NO ❌');

if (!API_KEY) {
  console.error("⚠️ Gemini API key not found!");
}

const genAI = new GoogleGenerativeAI(API_KEY);


export const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

// Option 3: If above fails, try this
// export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Option 4: If all fail, try this
// export const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

export const initChat = () => {
  console.log('🤖 Initializing chat...');
  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ 
          text: "You are an expert AI trading assistant for an Indian stock trading platform. Provide market analysis, stock recommendations, explain trading concepts. Be professional and concise." 
        }],
      },
      {
        role: "model",
        parts: [{ 
          text: "Hello! I'm your AI trading assistant. I can help with Indian stock market analysis, trading strategies, and insights on NSE/BSE stocks. How can I assist you?" 
        }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.7,
    },
  });
};
