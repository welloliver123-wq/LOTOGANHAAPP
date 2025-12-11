import { GoogleGenAI } from "@google/genai";
import { NumberStat } from "../types";

const apiKey = process.env.API_KEY || ''; // Assuming environment variable is set
const ai = new GoogleGenAI({ apiKey });

export const getAiAnalysis = async (hot: NumberStat[], cold: NumberStat[]) => {
  if (!apiKey) return "API Key not configured. (Simulated AI Analysis): Focus on balancing the hot numbers with a few overdue cold numbers.";

  const hotStr = hot.map(n => n.number).join(', ');
  const coldStr = cold.map(n => n.number).join(', ');

  const prompt = `
    Atue como um especialista matemático em loterias (especificamente Lotofácil).
    
    Dados estatísticos recentes:
    - Números mais frequentes (Quentes): ${hotStr}
    - Números menos frequentes (Frios): ${coldStr}
    
    Forneça uma análise curta (máximo 3 parágrafos) sobre a tendência atual. 
    Sugira uma estratégia de equilíbrio para o próximo jogo.
    Mantenha um tom profissional, analítico, mas lembre o usuário que é um jogo de sorte.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error", error);
    return "Não foi possível conectar ao assistente inteligente no momento. Tente novamente mais tarde.";
  }
};

export const getResponsibleGamingTip = async () => {
  if (!apiKey) return "Jogo responsável: Defina um orçamento fixo e nunca jogue dinheiro que fará falta.";

  const prompt = "Gere uma frase curta e impactante sobre Jogo Responsável e gestão de banca em loterias.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Jogue com responsabilidade.";
  }
}