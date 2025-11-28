import { GoogleGenAI } from "@google/genai";
import { Place } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIcebreaker = async (bio: string, name: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Hey! I saw your profile and thought it was cool.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert dating coach 'Wingman'. Generate a short, witty, and charming icebreaker message (max 1 sentence) to send to ${name} based on their bio: "${bio}". Do not use hashtags.`,
    });
    return response.text?.trim() || `Hey ${name}, your bio is interesting!`;
  } catch (error) {
    console.error("Gemini Icebreaker Error:", error);
    return `Hey ${name}, how's it going?`;
  }
};

export const generateBioAnalysis = async (bio: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Detailed compatibility analysis requires an API key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this dating profile bio and give me a 3 bullet point summary of their likely personality traits and potential red/green flags. Keep it punchy and fun. Bio: "${bio}"`,
    });
    return response.text?.trim() || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Could not analyze bio at this time.";
  }
};

export const findPlacesNearby = async (category: string, lat?: number, lng?: number): Promise<Place[] | null> => {
  const ai = getAiClient();
  if (!ai || !lat || !lng) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 5 popular ${category} nearby.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    // Extract structured data from grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Filter for valid map chunks and format them
    const places: Place[] = chunks
      .filter((c: any) => c.maps?.title)
      .map((c: any) => ({
        name: c.maps.title,
        uri: c.maps.uri,
        // Mock a rating since grounding chunks don't always provide it directly in the top-level object
        rating: (4.0 + Math.random()).toFixed(1) 
      }));

    // Simple deduplication based on name
    const uniquePlaces = Array.from(new Map(places.map((p) => [p.name, p])).values());

    return uniquePlaces.length > 0 ? uniquePlaces : null;
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return null;
  }
};