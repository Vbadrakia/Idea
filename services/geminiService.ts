import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRejectionFeedback = async (request: FeedbackRequest): Promise<string> => {
  try {
    const prompt = `
      You are a professional and empathetic HR recruiter.
      Task: Write a rejection feedback message for a candidate.
      
      Candidate Name: ${request.candidateName}
      Job Title: ${request.jobTitle}
      Reasons for rejection: ${request.reasons.join(', ')}
      Desired Tone: ${request.tone}
      
      Requirements:
      1. Be transparent but kind.
      2. Specifically mention the reasons provided to give closure.
      3. Keep it under 80 words.
      4. Do not use a generic "boilerplate" opening if possible, make it sound personal.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Thank you for your application. Unfortunately, we have decided to move forward with other candidates.";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Thank you for applying. At this time, we have decided to pursue other candidates whose skills more closely match our current needs.";
  }
};

export const generateCareerStrategy = async (currentSkills: string[], targetRole: string): Promise<string> => {
  try {
    const prompt = `
      You are a career growth advisor. 
      Analyze the candidate's skills: ${currentSkills.join(', ')}.
      Target role: ${targetRole}.
      
      Task:
      1. Identify the top 3 skill gaps.
      2. Recommend 2 specific learning resources or projects.
      3. Provide a motivational "next step".
      Keep it professional, actionable, and under 100 words.
      Format the output with clean line breaks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Analyze your skill gaps and start a project in that area.";
  } catch (error) {
    console.error("Error generating career advice:", error);
    return "Keep learning and building projects to reach your target role.";
  }
};

export interface AIScoreResponse {
  score: number;
  reason: string;
}

export const scoreCandidateMatch = async (candidateData: any, jobData: any): Promise<AIScoreResponse> => {
  try {
    const prompt = `
      You are an AI Talent Sourcing Expert.
      Analyze the candidate against the job description and provide a match score (0-100) and a concise reason.

      CANDIDATE:
      - Skills: ${candidateData.skills?.join(', ')}
      - Experience: ${candidateData.experience || 'Not specified'}
      - Role: ${candidateData.currentRole || 'Not specified'}

      JOB:
      - Title: ${jobData.title}
      - Requirements: ${jobData.requirements?.join(', ')}
      - Responsibilities: ${jobData.responsibilities?.join(', ')}

      Return a JSON object with:
      "score": number,
      "reason": string (max 30 words)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["score", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"score": 50, "reason": "Moderate match based on fundamentals."}');
    return result;
  } catch (error) {
    console.error("Error scoring candidate:", error);
    return { score: 50, reason: "Manual review recommended due to analysis error." };
  }
};