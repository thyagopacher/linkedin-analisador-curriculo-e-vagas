
import { GoogleGenAI, Type } from "@google/genai";
import { LinkedInAnalysis, AnalysisRequest } from "../types";

export const analyzeCareerData = async (data: AnalysisRequest): Promise<LinkedInAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Você é um Recrutador Sênior e Especialista em Carreira de TI (Nível Staff/Principal Engineer).
    Analise o perfil: ${data.linkedinUrl}

    REGRAS CRÍTICAS PARA A ANÁLISE SÊNIOR:
    1. IDENTIFICAÇÃO: Identifique a empresa atual (ex: Movida Locações), o cargo (ex: Sênior) e a stack (PHP/Laravel).
    2. REALISMO: NUNCA sugira "criar framework próprio" ou "fazer cursos básicos". Profissionais sêniores focam em ARQUITETURA, ESCALABILIDADE, TESTES (PHPUnit), PERFORMANCE e LIDERANÇA.
    3. FOCO EM VAGAS: Procure vagas que exijam maturidade técnica (Tech Lead, Senior III, Specialist) e que valorizem o ecossistema PHP moderno.
    4. ESCRITA PROFISSIONAL: Identifique onde a escrita do usuário é "modesta" ou "operacional" e sugira como transformá-la em "foco em resultado". 
       Ex: Trocar "Desenvolvi em PHP" por "Arquitetei soluções escaláveis em PHP/Laravel para o core de locação, reduzindo o tempo de resposta em X%".

    Sua resposta deve ser um JSON estrito:
    {
      "profileSummary": "Resumo executivo real (ex: Especialista PHP/Laravel com atuação sólida em sistemas críticos de logística na Movida)",
      "detectedRole": "Cargo real detectado",
      "detectedCompany": "Empresa atual",
      "matchScore": 95,
      "bestJobMatch": { "title": "Título da Vaga Sênior/Lead", "company": "Empresa", "location": "Local", "url": "URL LinkedIn" },
      "otherJobsFound": [ { "title": "Vaga", "company": "Empresa", "location": "Local", "url": "URL" } ],
      "strengths": ["Pontos de maestria técnica demonstrados"],
      "gaps": ["O que falta para o próximo nível (ex: Design System, Cloud Distribuída, Gestão de Stakeholders)"],
      "suggestedSkills": ["Hard skills avançadas relevantes"],
      "profileImprovements": [
        { 
          "section": "Título/Sobre/Experiência", 
          "currentIssue": "Trecho que parece 'júnior' ou apenas operacional", 
          "suggestion": "Como vender impacto e autoridade", 
          "example": "Texto sugerido focado em impacto e métricas" 
        }
      ],
      "overallVerdict": "Parecer de senioridade realista."
    }

    Responda em Português do Brasil.
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
          detectedRole: { type: Type.STRING },
          detectedCompany: { type: Type.STRING },
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
        required: ["profileSummary", "detectedRole", "detectedCompany", "matchScore", "bestJobMatch", "otherJobsFound", "strengths", "gaps", "suggestedSkills", "profileImprovements", "overallVerdict"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return result as LinkedInAnalysis;
  } catch (error) {
    throw new Error("Erro ao processar perfil sênior. Tente novamente.");
  }
};
