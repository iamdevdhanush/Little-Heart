import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIResponse {
  text: string;
  risk: "Low" | "Medium" | "High";
  reason: string;
  priority_action: string;
  steps: string[];
  confidence: "Low" | "Medium" | "High";
  internal_link?: {
    screen: 'home' | 'insights' | 'community' | 'profile';
    label: string;
  };
}

// Translation Service using Gemini
export async function translateText(text: string, targetLangCode: string): Promise<string> {
  if (!text) return text;
  const langMap: Record<string, string> = { hi: 'Hindi', kn: 'Kannada', en: 'English' };
  const targetLang = langMap[targetLangCode] || 'English';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLang}. Return ONLY the translation, without any quotes or extra text.\n\nText: "${text}"`
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function translateResponse(data: any, targetLangCode: string): Promise<any> {
  if (targetLangCode === 'en') return data;
  const langMap: Record<string, string> = { hi: 'Hindi', kn: 'Kannada', en: 'English' };
  const targetLang = langMap[targetLangCode] || 'English';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the string values of the following JSON object to ${targetLang}. 
      Keep the JSON keys exactly the same. 
      DO NOT translate the values for "risk", "confidence", or "internal_link.screen".
      Return ONLY valid JSON.
      
      JSON:
      ${JSON.stringify(data)}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Response translation error:", error);
    return data;
  }
}

export async function getChatResponse(message: string, profile: any, history: { role: 'user' | 'ai', text: string }[] = [], language: string = 'en'): Promise<AIResponse> {
  console.log("getChatResponse called with:", { message, language });
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined!");
  }
  try {
    // 1. Translate user input to English for AI processing
    const englishMessage = language !== 'en' ? await translateText(message, 'en') : message;
    console.log("Translated message:", englishMessage);

    // 2. Process with AI in English
    const historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    
    console.log("Sending request to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        User Profile: ${JSON.stringify(profile)}
        
        CONVERSATION HISTORY:
        ${historyContext}
        
        Current User Message: ${englishMessage}
        
        You are "Little Heartbeat", a senior AI maternal health assistant.
        Your primary goal is real-time maternal risk assessment and providing actionable, educational support.
        
        CONTEXT-AWARE RULES:
        - Use the conversation history to provide contextually relevant responses.
        - Consider pregnancy month, age, due date, medical conditions, and allergies.
        - Provide SPECIFIC actionable advice for the current month (e.g., Month 4: focus on iron; Month 7: watch for swelling).
        - If a risk is identified, provide clear, non-scary steps to manage it.
        - Use VERY SIMPLE ENGLISH. NO medical jargon.
        - Be calm, supportive, and clear.
        - Use Google Search to verify any medical information or provide the latest health guidelines.
        
        INTERNAL LINKS:
        You can suggest the user visit a specific section of the app if relevant.
        - "insights": For educational content, symptoms guide, or body support.
        - "home": For diet plans or baby growth tracking.
        - "community": To talk to other mothers.
        
        CRITICAL: Your response must be a JSON object with the following structure:
        {
          "text": "A warm, supportive response to the user's message with educational insight",
          "risk": "Low" | "Medium" | "High",
          "reason": "Simple explanation of WHY this risk level was chosen",
          "priority_action": "The single most important thing to do NOW",
          "steps": ["Actionable step 1", "Actionable step 2", "Educational tip"],
          "confidence": "Low" | "Medium" | "High",
          "internal_link": {
            "screen": "insights" | "home" | "community" | "profile",
            "label": "Click here to learn more about [topic]"
          }
        }
        
        EMERGENCY TRIGGER:
        If the user mentions severe pain, heavy bleeding, no baby movement, or very high BP/Sugar, set risk to "High" and priority_action to "Go to the nearest hospital immediately".
      `,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    if (!response.text) {
      console.error("Empty response from AI");
      throw new Error("Empty response from AI");
    }

    console.log("Received response from Gemini:", response.text);
    const aiData = JSON.parse(response.text);

    // 3. Translate the AI's response back to the user's selected language
    const translatedData = language !== 'en' ? await translateResponse(aiData, language) : aiData;
    console.log("Translated response:", translatedData);

    return translatedData;
  } catch (error) {
    console.error("AI Error:", error);
    return {
      text: language === 'hi' ? "मुझे खेद है, मुझे कनेक्ट करने में समस्या हो रही है। कृपया पुनः प्रयास करें।" : language === 'kn' ? "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕಿಸುವಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "I'm sorry, I'm having trouble connecting. Please try again or seek medical advice if you're worried.",
      risk: "Medium",
      reason: "Connection issues prevented full analysis",
      priority_action: "Monitor your symptoms closely",
      steps: ["Stay calm", "Contact your doctor if symptoms persist"],
      confidence: "Low"
    };
  }
}

export async function analyzeRisk(healthData: any, profile: any): Promise<AIResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Profile: ${JSON.stringify(profile)}
        Health Data: ${JSON.stringify(healthData)}
        
        Analyze the maternal health risk based on the provided structured data (BP, Sugar, Symptoms).
        Factor in the user's age, pregnancy month, due date, medical conditions, and allergies.
        
        CRITICAL: Your response must be a JSON object:
        {
          "text": "A summary of the health check results",
          "risk": "Low" | "Medium" | "High",
          "reason": "Simple explanation of the findings",
          "priority_action": "What the user must do NOW",
          "steps": ["Additional care step 1", "Additional care step 2"],
          "confidence": "Low" | "Medium" | "High"
        }
        
        Tone: Calm, supportive, clear. No jargon.
        Disclaimer: This is an AI assessment, not a medical diagnosis.
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return {
      text: "I couldn't complete the analysis right now.",
      risk: "Medium",
      reason: "Analysis service unavailable",
      priority_action: "Consult your doctor for a professional checkup",
      steps: ["Keep a record of your symptoms", "Rest and stay hydrated"],
      confidence: "Low"
    };
  }
}

export async function analyzeMedicalReport(extractedText: string, profile: any, language: string = 'en'): Promise<any> {
  try {
    const englishText = language !== 'en' ? await translateText(extractedText, 'en') : extractedText;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following medical report text for a pregnant patient.
        
        Patient Profile: ${JSON.stringify(profile)}
        
        Report Text:
        "${englishText}"
        
        Provide a structured, easy-to-understand summary of the findings.
        
        CRITICAL: Your response must be a JSON object with the following structure:
        {
          "summary": "A 2-3 sentence simple summary of the overall report status.",
          "vitalsRelation": "A clear section explaining how the report findings relate to the patient's current BP (${profile.bp}) and Sugar (${profile.sugar}) levels. If the report doesn't directly relate, explain how these vitals should be monitored in light of the findings.",
          "findings": ["Key finding 1 (e.g., Blood pressure is normal)", "Key finding 2"],
          "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"],
          "riskLevel": "Low" | "Medium" | "High",
          "hopefulMessage": "A warm, encouraging, and hopeful message for the mother, highlighting the positives and providing reassurance for any concerns."
        }
        
        TONE AND STYLE:
        - Be EXTREMELY supportive and hopeful.
        - Highlight POSITIVE findings first.
        - If there are negative findings, explain them in a non-scary, constructive way.
        - Give hope to the pregnant mother.
        - Do not use overly complex medical jargon. Explain things simply.
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    const aiData = JSON.parse(response.text || "{}");
    
    // Translate back if needed
    if (language !== 'en') {
      const translated = await translateResponse(aiData, language);
      return translated;
    }

    return aiData;
  } catch (error) {
    console.error("Report Analysis Error:", error);
    throw new Error("Failed to analyze report");
  }
}

