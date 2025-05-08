"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function runPointWise(extractedText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Highlight key points and main ideas, ensuring the summary captures essential information. \n\n${extractedText} in json format only with keys as "keyPoints", "mainIdeas" and "details" and dont create nested keys. You must ensure the JSON being returned or displayed is pure JSON, without any extra characters.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text(); // Summarized text

    // Clean up the JSON string to ensure it's valid
    let jsonString;
    
    // Try to find JSON within code blocks
    const jsonMatch = summary.match(/```json\s*([\s\S]*?)\s*```/) ||
                    summary.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      // If no code blocks, try to find JSON object directly
      const objectMatch = summary.match(/\{\s*"[\s\S]*"\s*:\s*[\s\S]*\}/);
      if (objectMatch) {
        jsonString = objectMatch[0];
      } else {
        // Last resort: take the whole text and clean it
        jsonString = summary.trim();
      }
    }
    
    // Clean up the JSON string - remove any non-JSON text before or after
    jsonString = jsonString.replace(/^[^[{]*/g, '').replace(/[^\]}]*$/g, '');
    
    try {
      const parsedSummary = JSON.parse(jsonString);
      return {
        success: true,
        data: parsedSummary
      };
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError, "Raw string:", jsonString);
      return { 
        success: false,
        error: "Failed to parse AI response. Please try again." 
      };
    }
  } catch (err) {
    console.error("Point extraction error:", err);
    return { 
      success: false,
      error: err.message 
    };
  }
} 