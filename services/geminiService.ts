
import { GoogleGenAI, Type } from "@google/genai";
import { LinkedInAnalysis, AnalysisRequest } from "../types";

export const analyzeCareerData = async (data: AnalysisRequest): Promise<LinkedInAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Aja como um Headhunter Sênior. 
    1. Pesquise e analise o perfil do LinkedIn nesta URL: ${data.linkedinUrl}.
    2. Com base nas competências desse perfil, pesquise no Google/LinkedIn por 3 a 5 vagas de emprego REAIS e RECENTES que estejam abertas e sejam compatíveis.
    3. Selecione a melhor vaga encontrada e faça uma análise completa de match.
    4. Identifique pontos de melhoria na escrita do perfil atual do candidato para torná-lo mais atraente para essas vagas específicas.

    Sua resposta deve ser um JSON seguindo esta estrutura:
    {
      "profileSummary": "Resumo do que você encontrou no perfil",
      "matchScore": 85,
      "bestJobMatch": { "title": "", "company": "", "location": "", "url": "" },
      "otherJobsFound": [ { "title": "", "company": "", "location": "", "url": "" } ],
      "strengths": ["ponto 1", "ponto 2"],
      "gaps": ["o que falta para a vaga top 1"],
      "suggestedSkills": ["skill 1", "skill 2"],
      "profileImprovements": [
        { "section": "Sobre/Experiência", "currentIssue": "O que está mal escrito", "suggestion": "Como melhorar", "example": "Exemplo de novo texto" }
      ],
      "overallVerdict": "Parecer final"
    }

    Responda apenas em Português do Brasil.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profileSummary: { type: Type.STRING },
          matchScore: { type: Type.NUMBER },
          bestJobMatch: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              url: { type: Type.STRING }
            }
          },
          otherJobsFound: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                url: { type: Type.STRING }
              }
            }
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          profileImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                currentIssue: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                example: { type: Type.STRING }
              }
            }
          },
          overallVerdict: { type: Type.STRING }
        },
        required: ["profileSummary", "matchScore", "bestJobMatch", "otherJobsFound", "strengths", "gaps", "suggestedSkills", "profileImprovements", "overallVerdict"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri,
      title: chunk.web?.title
    })).filter((s: any) => s.uri) || [];
    
    return { ...result, sources } as LinkedInAnalysis;
  } catch (error) {
    console.error("Erro ao processar:", error);
    throw new Error("Não foi possível acessar o perfil ou encontrar vagas. Verifique se o perfil é público.");
  }
};
