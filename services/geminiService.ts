
import { GoogleGenAI, Type } from "@google/genai";
import { PHYSICS_SYSTEM_PROMPT } from "../constants";
import { PhysicsData } from "../types";

export const fetchPhysicsSimulation = async (query: string): Promise<PhysicsData> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure VITE_GEMINI_API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: {
        systemInstruction: PHYSICS_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text) as PhysicsData;
    
    if (Object.keys(data).length === 0) {
      throw new Error("I couldn't generate a simple animation for that question. Try a simpler motion problem like a projectile or a braking car.");
    }

    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
