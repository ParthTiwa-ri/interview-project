// CoverLetterSchema.js
// This defines the structure of a cover letter in our application

export const defaultCoverLetterData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    date: new Date().toISOString().split('T')[0]
  },
  recipientInfo: {
    name: "",
    title: "",
    company: "",
    address: "",
    email: ""
  },
  letterContent: {
    greeting: "Dear Hiring Manager,",
    introduction: "",
    body: [
      {
        id: "body-1",
        paragraph: ""
      },
      {
        id: "body-2",
        paragraph: ""
      }
    ],
    conclusion: "",
    signature: "Sincerely,"
  },
  jobDetails: {
    title: "",
    company: "",
    reference: ""
  }
};

// Keep a counter to ensure IDs are unique even when created in the same millisecond
let idCounter = 0;

// Helper function to generate IDs for new sections
export const generateId = (prefix) => {
  // Increment counter for each ID generation
  idCounter++;
  return `${prefix}-${Date.now()}-${idCounter}`;
};

// Convert resume data to cover letter data for easier creation
export const resumeToCoverLetter = (resumeData) => {
  if (!resumeData) return defaultCoverLetterData;

  const coverLetterData = {
    ...defaultCoverLetterData,
    personalInfo: {
      ...defaultCoverLetterData.personalInfo,
      name: resumeData.personalInfo.name || "",
      email: resumeData.personalInfo.email || "",
      phone: resumeData.personalInfo.phone || "",
      address: resumeData.personalInfo.address || "",
      linkedin: resumeData.personalInfo.linkedin || ""
    }
  };

  // If we have job-specific information from the resume objective
  if (resumeData.personalInfo.objective) {
    const jobMatch = resumeData.personalInfo.objective.match(/position as a ([^where]+)/i);
    if (jobMatch && jobMatch[1]) {
      coverLetterData.jobDetails.title = jobMatch[1].trim();
    }
  }

  // Extract skills and experience for AI generation
  // This data will be used when clicking "Generate with AI" button
  const extractedData = {
    skills: [],
    experience: ""
  };

  // Extract skills from resume
  if (resumeData.skills) {
    if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
      extractedData.skills.push(...resumeData.skills.technical.filter(skill => skill.trim()));
    }
    if (resumeData.skills.soft && resumeData.skills.soft.length > 0) {
      extractedData.skills.push(...resumeData.skills.soft.filter(skill => skill.trim()));
    }
    if (resumeData.skills.languages && resumeData.skills.languages.length > 0) {
      extractedData.skills.push(...resumeData.skills.languages.filter(skill => skill.trim()));
    }
  }

  // Extract experience highlights
  if (resumeData.experience && resumeData.experience.length > 0) {
    const mostRecentExp = resumeData.experience[0];
    if (mostRecentExp) {
      const expParts = [];
      if (mostRecentExp.position) expParts.push(mostRecentExp.position);
      if (mostRecentExp.company) expParts.push(`at ${mostRecentExp.company}`);
      
      const expYears = [];
      if (mostRecentExp.startDate) expYears.push(mostRecentExp.startDate);
      if (mostRecentExp.endDate) expYears.push(mostRecentExp.endDate);
      
      if (expParts.length > 0) {
        extractedData.experience = expParts.join(' ');
        if (expYears.length > 0) {
          extractedData.experience += ` (${expYears.join(' - ')})`;
        }
      }
    }
  }

  // Store extracted data in localStorage for use in the CoverLetterForm component
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('resumeSkills', JSON.stringify(extractedData.skills));
    window.localStorage.setItem('resumeExperience', extractedData.experience);
  }

  return coverLetterData;
}; 