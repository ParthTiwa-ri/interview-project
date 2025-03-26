"use client";

import { HfInference } from "@huggingface/inference";
import { saveInterviewFeedback } from "../../../actions/action";

// Service for generating interview questions
export const generateInterviewQuestions = async (jobRole, experienceLevel = "Mid-Level", industry = "Technology", company = "") => {
  try {
    const client = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

   
    let companySpecificContent = "";
    if (company) {
      companySpecificContent = `The candidate is interviewing at ${company}. Include questions that reflect ${company}'s known interview style and company values.`;
    }

    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user",
          content: `Generate only 2 question realistic mock interview questions for a ${experienceLevel} ${jobRole} position in the ${industry} industry.

The questions should match the real-world expectations for a ${experienceLevel} candidate in this role and industry.
${companySpecificContent}

Include a mix of:
- Technical questions specific to the ${jobRole} role
- Behavioral questions relevant to ${experienceLevel} professionals
- Problem-solving scenarios a ${jobRole} would face in their daily work in the ${industry} industry
- Industry-specific knowledge questions relevant to ${industry}
          
Format your response EXACTLY as a JSON array with each object having 'id' and 'question' fields like this example:
[
  {
    "id": 1,
    "question": "Can you describe your experience with object-oriented programming and design principles? How have you applied these concepts in your past projects?"
  },
  {
    "id": 2,
    "question": "Tell me about a time when you had to troubleshoot and resolve a complex coding issue. What steps did you take to diagnose the problem and what was the outcome?"
  }
]

Return ONLY the JSON array with no additional text, explanation, or formatting.`,
        },
      ],
      provider: "hf-inference",
      max_tokens: 800,
    });

   
    const responseContent = chatCompletion.choices[0].message.content;
    console.log("Response from AI:", responseContent);

    
    // Improved extraction of JSON content
    let jsonString;
    
    // First try to find JSON within code blocks
    const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                      responseContent.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      // If no code blocks, try to find array directly
      const arrayMatch = responseContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
        jsonString = arrayMatch[0];
      } else {
        // Last resort: take the whole text and clean it
        jsonString = responseContent.trim();
      }
    }
    
    // Clean up the JSON string - remove any non-JSON text before or after
    jsonString = jsonString.replace(/^[^[{]*/g, '').replace(/[^\]}]*$/g, '');
    
    console.log("Cleaned JSON string:", jsonString);
    
    try {
      const parsedQuestions = JSON.parse(jsonString);

      // Handle both array and object with questions property
      const questionsArray = Array.isArray(parsedQuestions)
        ? parsedQuestions
        : parsedQuestions.questions || [];

      // Ensure each question has an id
      const formattedQuestions = questionsArray.map((q, index) => ({
        ...q,
        id: q.id || `q${index + 1}`,
      }));

      return { success: true, questions: formattedQuestions };
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError, "Raw string:", jsonString);
      
      // Fallback - try manual JSON creation for known format issues
      try {
        // Try to extract question text even if JSON is malformed
        const questionRegex = /"question"\s*:\s*"([^"]*?)"/g;
        let match;
        const extractedQuestions = [];
        let index = 1;
        
        while ((match = questionRegex.exec(jsonString)) !== null) {
          extractedQuestions.push({
            id: `q${index}`,
            question: match[1].replace(/\\"/g, '"')
          });
          index++;
        }
        
        if (extractedQuestions.length > 0) {
          return { success: true, questions: extractedQuestions };
        }
        
        throw new Error("Could not extract questions from malformed JSON");
      } catch (fallbackError) {
        console.error("Fallback extraction failed:", fallbackError);
        return { 
          success: false, 
          error: "Failed to parse AI response. Please try again." 
        };
      }
    }
  } catch (err) {
    console.error("API Error:", err);
    return { success: false, error: err.message };
  }
};

// Service for generating interview feedback
export const generateInterviewFeedback = async (
  jobRole, 
  questions, 
  answers, 
  experienceLevel = "Mid-Level", 
  industry = "Technology", 
  company = ""
) => {
  try {
    const client = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

    
    let companyContext = "";
    if (company) {
      companyContext = `The candidate is interviewing at ${company}. Evaluate their answers based on what would be expected at this company.`;
    }

    
    const batchPrompt = `
I need feedback on the following job interview for a ${experienceLevel} ${jobRole} position in the ${industry} industry.
${companyContext}

${questions
  .map(
    (q, index) => `
Question ${index + 1}: "${q.question}"
Candidate Answer: "${answers[q.id]}"
`
  )
  .join("\n")}

For each question, rate the answer from 1-10 based on expectations for a ${experienceLevel} candidate in the ${industry} industry, considering:
- Relevance to the question
- Technical accuracy
- Communication clarity
- Depth of knowledge appropriate for a ${experienceLevel} ${jobRole}
- Industry-specific awareness and knowledge

IMPORTANT SCORING GUIDELINES:
- A score of 1-3 is for answers that are very brief, off-topic, or show no understanding of the question
- A score of 4-6 is for answers that are on-topic but lack depth, detail, or proper explanation
- A score of 7-8 is for good answers that demonstrate solid understanding and provide relevant details
- A score of 9-10 is for excellent answers that are comprehensive, technically accurate, and well-articulated

Be very strict with your scoring. If the answer is incomplete, generic, or demonstrates poor understanding, it must receive a low score (1-3). NEVER give a high score (7+) to brief or incomplete answers.

Include strengths ONLY if they are genuinely present in the response. For answers scoring below 4, the "strengths" array may be empty.

Return a JSON object with the following structure:
{
  "questionFeedback": [
    {
      "id": "${questions[0]?.id || "q1"}",
      "score": 7,
      "feedback": "Detailed feedback here that directly references content from the answer",
      "strengths": ["Strength 1", "Strength 2"],
      "areas_to_improve": ["Area 1", "Area 2"]
    },
    {
      "id": "${questions[1]?.id || "q2"}",
      "score": 8,
      "feedback": "Detailed feedback here that directly references content from the answer",
      "strengths": ["Strength 1", "Strength 2"],
      "areas_to_improve": ["Area 1", "Area 2"]
    }
  ],
  "overall": {
    "averageScore": 7.5,
    "generalFeedback": "Overall assessment of the candidate based on the quality of their actual responses",
    "keyStrengths": ["Key strength 1", "Key strength 2"],
    "developmentAreas": ["Development area 1", "Development area 2"],
    "hiringRecommendation": "Would recommend hiring for a ${experienceLevel} ${jobRole} position at ${company || 'a company'} in the ${industry} industry only if the candidate demonstrated sufficient knowledge and skills"
  }
}

Only return the JSON object, no other text.
    `;

    const feedbackCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user",
          content: batchPrompt,
        },
      ],
      provider: "hf-inference",
      max_tokens: 1000,
    });

    const responseContent = feedbackCompletion.choices[0].message.content;
    console.log("Feedback response:", responseContent);

    // Improved extraction of JSON content
    let jsonString;
    
    // First try to find JSON within code blocks
    const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                      responseContent.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      // If no code blocks, try to find JSON object directly
      const objectMatch = responseContent.match(/\{\s*"[\s\S]*"\s*:\s*[\s\S]*\}/);
      if (objectMatch) {
        jsonString = objectMatch[0];
      } else {
        // Last resort: take the whole text and clean it
        jsonString = responseContent.trim();
      }
    }
    
    // Clean up the JSON string - remove any non-JSON text before or after
    jsonString = jsonString.replace(/^[^[{]*/g, '').replace(/[^\]}]*$/g, '');
    
    console.log("Cleaned feedback JSON string:", jsonString);
    
    try {
      const feedbackData = JSON.parse(jsonString);

      // Process individual question feedback
      const formattedScores = {};
      feedbackData.questionFeedback.forEach((qf) => {
        // Validate the feedback quality - ensure short answers don't get high scores
        const questionId = qf.id;
        const answer = answers[questionId] || "";
        
        // Check if answer is very short but got a high score (potential AI scoring issue)
        if (answer.length < 50 && qf.score > 6) {
          console.warn(`Suspicious scoring detected: Short answer (${answer.length} chars) got high score (${qf.score})`);
          // Adjust the score to be more reasonable
          qf.score = Math.min(qf.score, 3);
          
          // Adjust feedback to be more accurate
          if (!qf.feedback.includes("incomplete") && !qf.feedback.includes("brief")) {
            qf.feedback = `The answer is too brief and lacks necessary detail. ${qf.feedback}`;
          }
          
          // Adjust strengths if needed
          if (qf.strengths && qf.strengths.length > 0) {
            qf.strengths = ["Attempted to answer the question"];
          }
          
          // Ensure areas to improve reflects the brevity
          if (qf.areas_to_improve) {
            if (!qf.areas_to_improve.some(area => 
                area.includes("detail") || area.includes("elaborate") || area.includes("expand"))) {
              qf.areas_to_improve.push("Provide much more detail and specific examples");
            }
          }
        }
        
        formattedScores[qf.id] = {
          score: qf.score,
          feedback: qf.feedback,
          strengths: qf.strengths || [],
          areas_to_improve: qf.areas_to_improve || [],
        };
      });

      // Add overall feedback
      if (feedbackData.overall) {
        // Recalculate average score based on potentially adjusted individual scores
        if (feedbackData.questionFeedback && feedbackData.questionFeedback.length > 0) {
          const sum = feedbackData.questionFeedback.reduce((acc, qf) => acc + qf.score, 0);
          feedbackData.overall.averageScore = Math.round((sum / feedbackData.questionFeedback.length) * 10) / 10;
        }
        
        formattedScores.overall = feedbackData.overall;
      }

      return { success: true, scores: formattedScores };
    } catch (jsonError) {
      console.error("Feedback JSON Parsing Error:", jsonError, "Raw string:", jsonString);
      
      // Return error so user can try again
      return { 
        success: false, 
        error: "Failed to parse feedback response. Please try again." 
      };
    }
  } catch (err) {
    console.error("Feedback generation error:", err);
    return { success: false, error: err.message };
  }
};

// Service for saving interview to database
export const saveInterview = async (userId, jobRole, questions, answers, scores, industry = "Technology", company = "") => {
  try {
    const data = await saveInterviewFeedback({
      userId,
      jobRole,
      questions,
      answers,
      scores,
      industry,
      company
    });

    if (data.success) {
      return { success: true, sessionId: data.sessionId };
    } else {
      console.error("Failed to save to database:", data.error);
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.error("Error saving to database:", err);
    return { success: false, error: err.message };
  }
};

// Helper function to calculate total score
export const calculateTotalScore = (questions, scores) => {
  if (!scores.overall?.averageScore) {
    // Calculate manually if overall score isn't provided
    if (questions.length === 0) return 0;

    let total = 0;
    let count = 0;

    questions.forEach((q) => {
      if (scores[q.id] && typeof scores[q.id].score === "number") {
        total += scores[q.id].score;
        count++;
      }
    });

    return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  }

  return scores.overall.averageScore;
}; 