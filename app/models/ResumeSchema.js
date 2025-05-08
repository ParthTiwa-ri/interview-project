// ResumeSchema.js
// This defines the structure of a resume in our application

export const defaultResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
    objective: "",
  },
  education: [
    {
      id: "edu-1",
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      location: "",
      description: "",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      achievements: [""],
    },
  ],
  skills: {
    technical: [""],
    soft: [""],
    languages: [""],
    tools: [""],
  },
  projects: [
    {
      id: "proj-1",
      name: "",
      description: "",
      technologies: [""],
      link: "",
      startDate: "",
      endDate: "",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "",
      issuer: "",
      date: "",
      link: "",
    },
  ],
};

// Helper function to generate IDs for new sections
export const generateId = (prefix) => `${prefix}-${Date.now()}`;

// Convert interview data to resume data
export const interviewToResume = (
  user,
  jobRole,
  skills = []
) => {
  if (!user) return defaultResumeData;

  const resumeData = {
    ...defaultResumeData,
    personalInfo: {
      ...defaultResumeData.personalInfo,
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.primaryEmailAddress?.emailAddress || "",
    },
  };

  // Add the job role as the target position
  if (jobRole) {
    resumeData.personalInfo.objective = `Seeking a position as a ${jobRole} where I can utilize my skills and experience to contribute to company success.`;
  }

  // Add skills from interview answers if any
  if (skills && skills.length > 0) {
    resumeData.skills.technical = [...skills];
  }

  return resumeData;
}; 