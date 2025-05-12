/**
 * Generates an empty cover letter data object with default values
 * @returns {Object} Empty cover letter data structure
 */
export const getEmptyCoverLetterData = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return {
    personalInfo: {
      name: '',
      address: '',
      phone: '',
      email: '',
      linkedin: '',
      date: today
    },
    recipientInfo: {
      name: '',
      title: '',
      company: '',
      address: ''
    },
    jobDetails: {
      title: '',
      company: '',
      reference: ''
    },
    letterContent: {
      greeting: 'Dear Hiring Manager,',
      introduction: '',
      body: [
        { id: 1, paragraph: '' },
        { id: 2, paragraph: '' }
      ],
      conclusion: '',
      signature: 'Sincerely,'
    }
  };
};

/**
 * Converts resume data to cover letter data for easier transition between tools
 * @param {Object} resumeData - The resume data object
 * @returns {Object} Cover letter data pre-filled with resume information
 */
export const resumeToCoverLetter = (resumeData) => {
  // Start with an empty cover letter template
  const coverLetterData = getEmptyCoverLetterData();
  
  // Fill in personal information from resume
  if (resumeData.personalInfo) {
    coverLetterData.personalInfo = {
      ...coverLetterData.personalInfo,
      name: resumeData.personalInfo.name || '',
      address: resumeData.personalInfo.address || '',
      phone: resumeData.personalInfo.phone || '',
      email: resumeData.personalInfo.email || '',
      linkedin: resumeData.personalInfo.linkedin || ''
    };
  }
  
  // Try to extract job title from resume objective if available
  if (resumeData.personalInfo && resumeData.personalInfo.objective) {
    const jobMatch = resumeData.personalInfo.objective.match(/position as a ([^where]+)/i);
    if (jobMatch && jobMatch[1]) {
      coverLetterData.jobDetails.title = jobMatch[1].trim();
    }
  }
  
  // Pre-fill the body with suggested content based on the resume
  let introduction = '';
  if (resumeData.experience && resumeData.experience.length > 0) {
    const mostRecentJob = resumeData.experience[0];
    if (mostRecentJob.position) {
      introduction = `I am writing to express my interest in the [Position Name] position at [Company Name]. As a ${mostRecentJob.position}${mostRecentJob.company ? ` at ${mostRecentJob.company}` : ''}, I have developed valuable skills that align well with this role.`;
    }
  }
  
  if (!introduction && resumeData.personalInfo && resumeData.personalInfo.objective) {
    introduction = `I am writing to express my interest in the [Position Name] position at [Company Name]. ${resumeData.personalInfo.objective}`;
  }
  
  if (!introduction) {
    introduction = 'I am writing to express my interest in the [Position Name] position at [Company Name].';
  }
  
  coverLetterData.letterContent.introduction = introduction;
  
  // Create a paragraph about skills if available
  let skillsParagraph = '';
  if (resumeData.skills && (resumeData.skills.technical.some(s => s) || resumeData.skills.soft.some(s => s))) {
    const technicalSkills = resumeData.skills.technical.filter(s => s).join(', ');
    const softSkills = resumeData.skills.soft.filter(s => s).join(', ');
    
    if (technicalSkills && softSkills) {
      skillsParagraph = `My technical skills include ${technicalSkills}, while my soft skills include ${softSkills}. I believe these skills make me a well-rounded candidate who can contribute effectively to your team.`;
    } else if (technicalSkills) {
      skillsParagraph = `My technical skills include ${technicalSkills}. I believe these skills will allow me to excel in this role.`;
    } else if (softSkills) {
      skillsParagraph = `My soft skills include ${softSkills}. I believe these skills will allow me to work effectively with your team.`;
    }
  }
  
  if (skillsParagraph) {
    coverLetterData.letterContent.body[0].paragraph = skillsParagraph;
  }
  
  // Create a paragraph about experience if available
  let experienceParagraph = '';
  if (resumeData.experience && resumeData.experience.length > 0) {
    const significantExperience = resumeData.experience[0];
    if (significantExperience.company && significantExperience.position) {
      experienceParagraph = `In my role as ${significantExperience.position} at ${significantExperience.company}, I ${significantExperience.description || 'gained valuable experience that is directly relevant to this position'}. ${significantExperience.achievements && significantExperience.achievements.length > 0 ? `Some key achievements include ${significantExperience.achievements[0]}.` : ''}`;
    }
  }
  
  if (experienceParagraph) {
    coverLetterData.letterContent.body[1].paragraph = experienceParagraph;
  }
  
  // Pre-fill conclusion
  coverLetterData.letterContent.conclusion = "Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs. I am excited about the possibility of joining your team and contributing to your company's success.";
  
  return coverLetterData;
};

/**
 * Generate a unique ID for new elements
 * @returns {string} A unique ID based on timestamp
 */
export const generateId = () => {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Validates the cover letter data to ensure required fields are filled
 * @param {Object} data The cover letter data to validate
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateCoverLetterData = (data) => {
  const errors = {};
  
  // Check for required personal info
  if (!data.personalInfo.name) {
    errors.name = 'Name is required';
  }
  
  if (!data.personalInfo.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.personalInfo.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Job details validation
  if (!data.jobDetails.title) {
    errors.jobTitle = 'Job title is required';
  }
  
  if (!data.jobDetails.company) {
    errors.company = 'Company name is required';
  }
  
  // Letter content validation
  if (!data.letterContent.introduction) {
    errors.introduction = 'Introduction is required';
  }
  
  // Ensure at least one body paragraph has content
  if (!data.letterContent.body.some(para => para.paragraph.trim())) {
    errors.body = 'At least one body paragraph is required';
  }
  
  if (!data.letterContent.conclusion) {
    errors.conclusion = 'Conclusion is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Cleans the cover letter data by trimming whitespace and removing empty paragraphs
 * @param {Object} data The cover letter data to clean
 * @returns {Object} The cleaned cover letter data
 */
export const cleanCoverLetterData = (data) => {
  // Create a deep copy to avoid modifying the original
  const cleanedData = JSON.parse(JSON.stringify(data));
  
  // Trim whitespace from text fields in personal info
  Object.keys(cleanedData.personalInfo).forEach(key => {
    if (typeof cleanedData.personalInfo[key] === 'string') {
      cleanedData.personalInfo[key] = cleanedData.personalInfo[key].trim();
    }
  });
  
  // Trim whitespace from text fields in recipient info
  Object.keys(cleanedData.recipientInfo).forEach(key => {
    if (typeof cleanedData.recipientInfo[key] === 'string') {
      cleanedData.recipientInfo[key] = cleanedData.recipientInfo[key].trim();
    }
  });
  
  // Trim whitespace from text fields in job details
  Object.keys(cleanedData.jobDetails).forEach(key => {
    if (typeof cleanedData.jobDetails[key] === 'string') {
      cleanedData.jobDetails[key] = cleanedData.jobDetails[key].trim();
    }
  });
  
  // Clean letter content
  cleanedData.letterContent.greeting = cleanedData.letterContent.greeting.trim();
  cleanedData.letterContent.introduction = cleanedData.letterContent.introduction.trim();
  cleanedData.letterContent.conclusion = cleanedData.letterContent.conclusion.trim();
  cleanedData.letterContent.signature = cleanedData.letterContent.signature.trim();
  
  // Filter out empty paragraphs and trim content in body
  cleanedData.letterContent.body = cleanedData.letterContent.body
    .filter(para => para.paragraph.trim())
    .map(para => ({
      ...para,
      paragraph: para.paragraph.trim()
    }));
  
  // Ensure there's at least one paragraph in the body
  if (cleanedData.letterContent.body.length === 0) {
    cleanedData.letterContent.body = [{ id: generateId(), paragraph: '' }];
  }
  
  return cleanedData;
}; 