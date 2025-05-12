"use client";

import { useState, useEffect } from 'react';
import { cleanCoverLetterData, generateId, validateCoverLetterData } from '../../utils/coverLetterUtils';

const CoverLetterForm = ({ initialData, onSave }) => {
  const [coverLetterData, setCoverLetterData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  // Additional context for AI generation
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillText, setSkillText] = useState('');
  const [experience, setExperience] = useState('');
  
  useEffect(() => {
    setCoverLetterData(initialData);
    
    // Load skills and experience from localStorage if available
    if (typeof window !== 'undefined') {
      // Load skills
      const savedSkills = localStorage.getItem('resumeSkills');
      if (savedSkills) {
        try {
          const parsedSkills = JSON.parse(savedSkills);
          if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
            setSelectedSkills(parsedSkills);
          }
          // Clear from localStorage to avoid unexpected loading in future visits
          localStorage.removeItem('resumeSkills');
        } catch (error) {
          console.error('Error parsing skills data:', error);
        }
      }
      
      // Load experience
      const savedExperience = localStorage.getItem('resumeExperience');
      if (savedExperience) {
        setExperience(savedExperience);
        // Clear from localStorage
        localStorage.removeItem('resumeExperience');
      }
    }
  }, [initialData]);
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData({
      ...coverLetterData,
      personalInfo: {
        ...coverLetterData.personalInfo,
        [name]: value
      }
    });
  };
  
  const handleRecipientInfoChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData({
      ...coverLetterData,
      recipientInfo: {
        ...coverLetterData.recipientInfo,
        [name]: value
      }
    });
  };
  
  const handleJobDetailsChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData({
      ...coverLetterData,
      jobDetails: {
        ...coverLetterData.jobDetails,
        [name]: value
      }
    });
  };
  
  const handleLetterContentChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData({
      ...coverLetterData,
      letterContent: {
        ...coverLetterData.letterContent,
        [name]: value
      }
    });
  };
  
  const handleParagraphChange = (index, value) => {
    const updatedBody = [...coverLetterData.letterContent.body];
    updatedBody[index] = {
      ...updatedBody[index],
      paragraph: value
    };
    
    setCoverLetterData({
      ...coverLetterData,
      letterContent: {
        ...coverLetterData.letterContent,
        body: updatedBody
      }
    });
  };
  
  const addParagraph = () => {
    setCoverLetterData({
      ...coverLetterData,
      letterContent: {
        ...coverLetterData.letterContent,
        body: [
          ...coverLetterData.letterContent.body,
          {
            id: generateId(),
            paragraph: ''
          }
        ]
      }
    });
  };
  
  const removeParagraph = (index) => {
    const updatedBody = [...coverLetterData.letterContent.body];
    updatedBody.splice(index, 1);
    
    setCoverLetterData({
      ...coverLetterData,
      letterContent: {
        ...coverLetterData.letterContent,
        body: updatedBody
      }
    });
  };
  
  // Add a skill to the selected skills list
  const addSkill = () => {
    if (skillText.trim() && !selectedSkills.includes(skillText.trim())) {
      setSelectedSkills([...selectedSkills, skillText.trim()]);
      setSkillText('');
    }
  };

  // Remove a skill from the selected skills list
  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };
  
  const handleGenerateAICoverLetter = async () => {
    setIsAiGenerating(true);
    try {
      // This is where you would integrate with an AI model to generate content
      // For now, we'll generate more personalized content based on provided information
      
      // Gather context for AI generation
      const name = coverLetterData.personalInfo.name || 'the applicant';
      const jobTitle = coverLetterData.jobDetails.title || 'the position';
      const company = coverLetterData.jobDetails.company || 'your company';
      const skillsContext = selectedSkills.length > 0 
        ? `with skills in ${selectedSkills.join(', ')}` 
        : 'with a diverse skill set';
      const experienceContext = experience 
        ? `and experience in ${experience}` 
        : 'and relevant professional background';
      
      const aiGeneratedContent = {
        introduction: `I am writing to express my interest in the ${jobTitle} position at ${company}, as advertised on your company website. As a professional ${skillsContext} ${experienceContext}, I am confident that I would make a valuable addition to your team.`,
        body: [
          {
            id: `para-${Date.now()}-0`,
            paragraph: `Throughout my career, I have developed a strong skill set in ${selectedSkills.length > 0 ? selectedSkills.slice(0, 3).join(', ') : 'relevant areas'} that align perfectly with this role's requirements. ${experience ? `My experience in ${experience} has prepared me well for the challenges of this position.` : 'My background includes working on similar projects that required expertise in problem-solving, teamwork, and technical skills.'}`
          },
          {
            id: `para-${Date.now()}-1`,
            paragraph: `In my previous roles, I have ${selectedSkills.length > 0 ? `successfully applied my ${selectedSkills.slice(0, 2).join(' and ')} skills to` : 'successfully led several initiatives that'} improved efficiency and delivered measurable results. I am particularly proud of my ability to collaborate with cross-functional teams and stakeholders to achieve common goals. ${selectedSkills.length > 3 ? `Additionally, my knowledge of ${selectedSkills.slice(3).join(', ')} would bring additional value to the ${jobTitle} position.` : ''}`
          }
        ],
        conclusion: `I am excited about the opportunity to bring my unique skills and experiences to ${company}. I believe that my background makes me an ideal candidate for this position, and I would welcome the chance to discuss how I can contribute to your team's success. Thank you for considering my application.`
      };
      
      setCoverLetterData({
        ...coverLetterData,
        letterContent: {
          ...coverLetterData.letterContent,
          introduction: aiGeneratedContent.introduction,
          body: aiGeneratedContent.body,
          conclusion: aiGeneratedContent.conclusion
        }
      });
    } catch (error) {
      console.error("Error generating AI content:", error);
      setErrors({
        ...errors,
        ai: "There was an error generating content. Please try again."
      });
    } finally {
      setIsAiGenerating(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateCoverLetterData(coverLetterData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    const cleanedData = cleanCoverLetterData(coverLetterData);
    onSave(cleanedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          type="button"
          onClick={handleGenerateAICoverLetter}
          disabled={isAiGenerating}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        >
          {isAiGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Cover Letter
        </button>
      </div>
      
      {errors && errors.ai && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.ai}
        </div>
      )}
      
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
              {errors.name && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="name"
              value={coverLetterData.personalInfo.name}
              onChange={handlePersonalInfoChange}
              className={`mt-1 block w-full border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
              {errors.email && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              name="email"
              value={coverLetterData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className={`mt-1 block w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={coverLetterData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={coverLetterData.personalInfo.address}
              onChange={handlePersonalInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={coverLetterData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={coverLetterData.personalInfo.date}
              onChange={handlePersonalInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>
      
      {/* Recipient Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recipient Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
            <input
              type="text"
              name="name"
              value={coverLetterData.recipientInfo.name}
              onChange={handleRecipientInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., John Smith or Hiring Manager"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={coverLetterData.recipientInfo.title}
              onChange={handleRecipientInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., HR Director"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="company"
              value={coverLetterData.recipientInfo.company}
              onChange={handleRecipientInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <input
              type="text"
              name="address"
              value={coverLetterData.recipientInfo.address}
              onChange={handleRecipientInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={coverLetterData.recipientInfo.email}
              onChange={handleRecipientInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
      </div>
      
      {/* Job Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
              {errors.jobTitle && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="title"
              value={coverLetterData.jobDetails.title}
              onChange={handleJobDetailsChange}
              className={`mt-1 block w-full border ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
            />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
              {errors.company && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name="company"
              value={coverLetterData.jobDetails.company}
              onChange={handleJobDetailsChange}
              className={`mt-1 block w-full border ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Reference</label>
            <input
              type="text"
              name="reference"
              value={coverLetterData.jobDetails.reference}
              onChange={handleJobDetailsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Job ID or where you found the listing"
            />
          </div>
        </div>
      </div>
      
      {/* AI Generation Context */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills & Experience for AI Generation</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add skills and experience details to create a more personalized cover letter with AI. 
          This information is only used for AI generation and is not included in the final letter.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillText}
              onChange={(e) => setSkillText(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Project Management, JavaScript, Leadership"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSkills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                  <span>{skill}</span>
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relevant Experience
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Briefly describe your relevant experience, e.g., '5 years in software development with focus on web applications'"
          />
        </div>
      </div>
      
      {/* Letter Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Letter Content</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Greeting</label>
          <input
            type="text"
            name="greeting"
            value={coverLetterData.letterContent.greeting}
            onChange={handleLetterContentChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Introduction
            {errors.introduction && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name="introduction"
            value={coverLetterData.letterContent.introduction}
            onChange={handleLetterContentChange}
            rows={3}
            className={`mt-1 block w-full border ${
              errors.introduction ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
            placeholder="Explain why you're writing and which position you're applying for"
          />
          {errors.introduction && <p className="text-red-500 text-xs mt-1">{errors.introduction}</p>}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Body Paragraphs
              {errors.body && <span className="text-red-500 ml-1">*</span>}
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Paragraph
            </button>
          </div>
          
          {errors.body && <p className="text-red-500 text-xs mb-2">{errors.body}</p>}
          
          {coverLetterData.letterContent.body.map((paragraph, index) => (
            <div key={paragraph.id} className="mb-3 relative">
              <textarea
                value={paragraph.paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                placeholder={`Paragraph ${index + 1}: Highlight relevant skills and experiences`}
              />
              {coverLetterData.letterContent.body.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Conclusion
            {errors.conclusion && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name="conclusion"
            value={coverLetterData.letterContent.conclusion}
            onChange={handleLetterContentChange}
            rows={3}
            className={`mt-1 block w-full border ${
              errors.conclusion ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
            placeholder="Summarize why you're a good fit and express interest in an interview"
          />
          {errors.conclusion && <p className="text-red-500 text-xs mt-1">{errors.conclusion}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Signature</label>
          <input
            type="text"
            name="signature"
            value={coverLetterData.letterContent.signature}
            onChange={handleLetterContentChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Cover Letter
        </button>
      </div>
    </form>
  );
};

export default CoverLetterForm; 