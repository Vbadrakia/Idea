import { GoogleGenAI } from "@google/genai";
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