import { GoogleGenAI, Type } from "@google/genai";
import { DreamReading } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to generate a deterministic integer seed from a string
const generateSeed = (text: string): number => {
  let hash = 0;
  const cleanText = text.toLowerCase().trim();
  if (cleanText.length === 0) return hash;
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getGeminiOracleReading = async (birthDate: Date): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing");
    return "O Oráculo está dormindo. (Chave de API não configurada)";
  }

  try {
    const formattedDate = birthDate.toLocaleDateString('pt-BR');
    
    const prompt = `
      Você é o "Mestre Dinho", um bicheiro místico e sábio.
      O usuário nasceu em ${formattedDate}.
      Forneça um conselho curto, místico e divertido sobre a sorte dele hoje.
      Relacione com animais ou elementos da natureza.
      Não mencione números específicos, foque na "vibração" ou "intuição".
      Limite a 3 frases curtas.
      Tom de voz: Misterioso mas encorajador.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "A sorte sorri para quem acredita.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "As nuvens encobrem o oráculo hoje. Tente novamente mais tarde.";
  }
};

export const interpretDream = async (dreamText: string): Promise<DreamReading | null> => {
  if (!ai) {
    console.warn("API Key missing for dream interpretation");
    return null;
  }

  try {
    // Generate a deterministic seed from the dream text
    // This ensures that "sonhei com cachorro" always yields the same numbers
    const seed = generateSeed(dreamText);

    const prompt = `
      Você é um especialista no Livro dos Sonhos do Jogo do Bicho.
      O usuário sonhou com: "${dreamText}".
      Interprete este sonho e indique qual o bicho, grupo, dezenas e um milhar da sorte associado.
      
      Retorne APENAS um objeto JSON com o seguinte formato, sem markdown:
      {
        "bicho": "Nome do Bicho",
        "grupo": 0,
        "dezenas": [0, 0, 0, 0],
        "milhar": "0000",
        "explicacao": "Uma frase curta explicando a relação do sonho com o bicho."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        seed: seed, // Deterministic output based on input
        temperature: 0.3, // Lower temperature for more consistent results
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bicho: { type: Type.STRING },
            grupo: { type: Type.INTEGER },
            dezenas: { 
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            },
            milhar: { type: Type.STRING },
            explicacao: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as DreamReading;

  } catch (error) {
    console.error("Dream Interpretation Error:", error);
    return null;
  }
};