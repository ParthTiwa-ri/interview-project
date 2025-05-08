// Generate a unique ID for new resume items
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Returns an empty resume data structure
export const getEmptyResumeData = () => {
  return {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: '',
      objective: ''
    },
    education: [
      {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ],
    experience: [
      {
        id: generateId(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: ['', '', '']
      }
    ],
    skills: {
      technical: ['', '', '', '', ''],
      soft: ['', '', ''],
      languages: ['', '']
    },
    projects: [
      {
        id: generateId(),
        name: '',
        description: '',
        link: '',
        startDate: '',
        endDate: '',
        technologies: ['', '', '']
      }
    ],
    certifications: [
      {
        id: generateId(),
        name: '',
        issuer: '',
        date: '',
        link: ''
      }
    ]
  };
};

// Validates resume data
export const validateResumeData = (data) => {
  const errors = {};
  
  // Check required personal info
  if (!data.personalInfo.name) {
    errors.name = 'Name is required';
  }
  
  if (!data.personalInfo.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.personalInfo.email)) {
    errors.email = 'Invalid email format';
  }
  
  // There could be more validation logic here...
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function for email validation
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Filter out empty fields in resume data
export const cleanResumeData = (data) => {
  const cleaned = { ...data };
  
  // Clean arrays by filtering out empty items
  cleaned.education = cleaned.education.filter(edu => 
    edu.institution || edu.degree || edu.field
  );
  
  cleaned.experience = cleaned.experience.filter(exp => 
    exp.company || exp.position || exp.description
  );
  
  cleaned.projects = cleaned.projects.filter(proj => 
    proj.name || proj.description
  );
  
  cleaned.certifications = cleaned.certifications.filter(cert => 
    cert.name || cert.issuer
  );
  
  // For each experience, clean the achievements array
  cleaned.experience = cleaned.experience.map(exp => ({
    ...exp,
    achievements: exp.achievements.filter(a => a)
  }));
  
  // For each project, clean the technologies array
  cleaned.projects = cleaned.projects.map(proj => ({
    ...proj,
    technologies: proj.technologies.filter(t => t)
  }));
  
  // Clean skills
  cleaned.skills = {
    technical: cleaned.skills.technical.filter(skill => skill),
    soft: cleaned.skills.soft.filter(skill => skill),
    languages: cleaned.skills.languages.filter(skill => skill)
  };
  
  return cleaned;
}; 