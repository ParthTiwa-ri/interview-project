"use client";

import { useState, useEffect } from 'react';
import { defaultResumeData, generateId } from '../../models/ResumeSchema';

const ResumeForm = ({ initialData = defaultResumeData, onSave }) => {
  const [resumeData, setResumeData] = useState(initialData);
  
  useEffect(() => {
    setResumeData(initialData);
  }, [initialData]);
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value
      }
    });
  };
  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setResumeData({
      ...resumeData,
      education: updatedEducation
    });
  };
  
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };
  
  const handleExperienceAchievementChange = (expIndex, achieveIndex, value) => {
    const updatedExperience = [...resumeData.experience];
    const updatedAchievements = [...updatedExperience[expIndex].achievements];
    updatedAchievements[achieveIndex] = value;
    
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      achievements: updatedAchievements
    };
    
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };
  
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };
  
  const handleSkillChange = (category, index, value) => {
    const updatedSkills = {...resumeData.skills};
    const skillArray = [...updatedSkills[category]];
    skillArray[index] = value;
    
    setResumeData({
      ...resumeData,
      skills: {
        ...updatedSkills,
        [category]: skillArray
      }
    });
  };
  
  // Add/Remove functions for all sections
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: generateId('edu'),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
          location: "",
          description: ""
        }
      ]
    });
  };
  
  const removeEducation = (index) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    setResumeData({
      ...resumeData,
      education: updatedEducation
    });
  };
  
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: generateId('exp'),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          achievements: [""]
        }
      ]
    });
  };
  
  const removeExperience = (index) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };
  
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: generateId('proj'),
          name: "",
          description: "",
          technologies: [""],
          link: "",
          startDate: "",
          endDate: ""
        }
      ]
    });
  };
  
  const removeProject = (index) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects.splice(index, 1);
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };
  
  const addSkill = (category) => {
    const updatedSkills = {...resumeData.skills};
    updatedSkills[category] = [...updatedSkills[category], ""];
    
    setResumeData({
      ...resumeData,
      skills: updatedSkills
    });
  };
  
  const removeSkill = (category, index) => {
    const updatedSkills = {...resumeData.skills};
    const skillArray = [...updatedSkills[category]];
    skillArray.splice(index, 1);
    
    setResumeData({
      ...resumeData,
      skills: {
        ...updatedSkills,
        [category]: skillArray
      }
    });
  };
  
  const addAchievement = (experienceIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      achievements: [...updatedExperience[experienceIndex].achievements, ""]
    };
    
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };
  
  const removeAchievement = (experienceIndex, achievementIndex) => {
    const updatedExperience = [...resumeData.experience];
    const achievements = [...updatedExperience[experienceIndex].achievements];
    achievements.splice(achievementIndex, 1);
    
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      achievements: achievements
    };
    
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(resumeData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={resumeData.personalInfo.name}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={resumeData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={resumeData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={resumeData.personalInfo.address}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={resumeData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="url"
              name="github"
              value={resumeData.personalInfo.github}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
            <textarea
              name="objective"
              value={resumeData.personalInfo.objective}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
        </div>
      </div>
      
      {/* Education */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Education</h2>
          <button 
            type="button" 
            onClick={addEducation}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Add Education
          </button>
        </div>
        
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="mb-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/YYYY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {resumeData.education.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeEducation(index)}
                className="mt-3 text-red-600 text-sm hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Experience */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Experience</h2>
          <button 
            type="button" 
            onClick={addExperience}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Add Experience
          </button>
        </div>
        
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="mb-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/YYYY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
                  <button 
                    type="button" 
                    onClick={() => addAchievement(index)}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Achievement
                  </button>
                </div>
                
                {exp.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleExperienceAchievementChange(index, achievementIndex, e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Describe a key achievement..."
                    />
                    
                    {exp.achievements.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeAchievement(index, achievementIndex)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <span className="sr-only">Remove</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {resumeData.experience.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeExperience(index)}
                className="mt-3 text-red-600 text-sm hover:text-red-800"
              >
                Remove Experience
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Skills */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Skills</h2>
        
        <div className="space-y-6">
          {/* Technical Skills */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
              <button 
                type="button" 
                onClick={() => addSkill('technical')}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>
            
            <div className="space-y-2">
              {resumeData.skills.technical.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange('technical', index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., JavaScript, Python, AWS"
                  />
                  
                  {resumeData.skills.technical.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSkill('technical', index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Soft Skills */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Soft Skills</label>
              <button 
                type="button" 
                onClick={() => addSkill('soft')}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>
            
            <div className="space-y-2">
              {resumeData.skills.soft.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange('soft', index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Communication, Leadership"
                  />
                  
                  {resumeData.skills.soft.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSkill('soft', index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Projects</h2>
          <button 
            type="button" 
            onClick={addProject}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Add Project
          </button>
        </div>
        
        {resumeData.projects.map((project, index) => (
          <div key={project.id} className="mb-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>
            </div>
            
            {resumeData.projects.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeProject(index)}
                className="mt-3 text-red-600 text-sm hover:text-red-800"
              >
                Remove Project
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Save Resume
        </button>
      </div>
    </form>
  );
};

export default ResumeForm; 