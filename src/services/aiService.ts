import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

export async function getChatResponse(message: string, profile: any, history: { role: 'user' | 'ai', text: string }[] = []): Promise<AIResponse> {
  try {
    const historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        User Profile: ${JSON.stringify(profile)}
        
        CONVERSATION HISTORY:
        ${historyContext}
        
        Current User Message: ${message}
        
        You are "Little Heartbeat", a senior AI maternal health assistant.
        Your primary goal is real-time maternal risk assessment and providing actionable, educational support.
        
        CONTEXT-AWARE RULES:
        - Use the conversation history to provide contextually relevant responses.
        - Consider pregnancy month, age, due date, medical conditions, and allergies.
        - Provide SPECIFIC actionable advice for the current month (e.g., Month 4: focus on iron; Month 7: watch for swelling).
        - If a risk is identified, provide clear, non-scary steps to manage it.
        - Use VERY SIMPLE ENGLISH. NO medical jargon.
        - Be calm, supportive, and clear.
        
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
          } (optional)
        }
        
        EMERGENCY TRIGGER:
        If the user mentions severe pain, heavy bleeding, no baby movement, or very high BP/Sugar, set risk to "High" and priority_action to "Go to the nearest hospital immediately".
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Error:", error);
    return {
      text: "I'm sorry, I'm having trouble connecting. Please try again or seek medical advice if you're worried.",
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
