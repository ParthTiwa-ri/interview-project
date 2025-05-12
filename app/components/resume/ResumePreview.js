"use client";

import { useRef } from 'react';
import { generatePDF, generateJSON } from '../../utils/pdfGenerator';

const ResumePreview = ({ resumeData, onEdit, onCreateCoverLetter }) => {
  const resumeRef = useRef(null);
  
  const handleDownloadPDF = async () => {
    try {
      await generatePDF('resume-content', resumeData, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const handleDownloadJSON = () => {
    try {
      generateJSON(resumeData, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume_Data.json`);
    } catch (error) {
      console.error('Failed to generate JSON:', error);
      alert('Failed to generate JSON. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Edit Resume
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download JSON
          </button>
          <button
            onClick={onCreateCoverLetter}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Create Cover Letter
          </button>
        </div>
      </div>
      
      {/* Resume Preview */}
      <div 
        id="resume-content"
        ref={resumeRef} 
        className="bg-white shadow-md border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header/Contact Info */}
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">{resumeData.personalInfo.name}</h1>
          
          <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600">
            {resumeData.personalInfo.email && (
              <div>{resumeData.personalInfo.email}</div>
            )}
            {resumeData.personalInfo.phone && (
              <div>{resumeData.personalInfo.phone}</div>
            )}
            {resumeData.personalInfo.address && (
              <div>{resumeData.personalInfo.address}</div>
            )}
            {resumeData.personalInfo.linkedin && (
              <div>{resumeData.personalInfo.linkedin}</div>
            )}
            {resumeData.personalInfo.github && (
              <div>{resumeData.personalInfo.github}</div>
            )}
          </div>
        </div>
        
        {/* Professional Summary */}
        {resumeData.personalInfo.objective && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm text-gray-700">{resumeData.personalInfo.objective}</p>
          </div>
        )}
        
        {/* Skills */}
        {(resumeData.skills.technical.some(skill => skill) || resumeData.skills.soft.some(skill => skill)) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.skills.technical.some(skill => skill) && (
                <div>
                  <h3 className="text-md font-medium mb-1">Technical Skills</h3>
                  <p className="text-sm text-gray-700">
                    {resumeData.skills.technical.filter(skill => skill).join(", ")}
                  </p>
                </div>
              )}
              
              {resumeData.skills.soft.some(skill => skill) && (
                <div>
                  <h3 className="text-md font-medium mb-1">Soft Skills</h3>
                  <p className="text-sm text-gray-700">
                    {resumeData.skills.soft.filter(skill => skill).join(", ")}
                  </p>
                </div>
              )}
              
              {resumeData.skills.languages.some(skill => skill) && (
                <div>
                  <h3 className="text-md font-medium mb-1">Languages</h3>
                  <p className="text-sm text-gray-700">
                    {resumeData.skills.languages.filter(skill => skill).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Experience */}
        {resumeData.experience.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Experience</h2>
            
            {resumeData.experience
              .filter(exp => exp.company || exp.position)
              .map((exp, index) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium">{exp.position}</h3>
                      <p className="text-sm text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate && (
                        <span>
                          {exp.startDate}
                          {exp.endDate && ` - ${exp.endDate}`}
                        </span>
                      )}
                      {exp.location && <span> | {exp.location}</span>}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  )}
                  
                  {exp.achievements && exp.achievements.some(a => a) && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1 ml-2">
                      {exp.achievements.filter(a => a).map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {/* Education */}
        {resumeData.education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Education</h2>
            
            {resumeData.education
              .filter(edu => edu.institution || edu.degree)
              .map((edu, index) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.startDate && (
                        <span>
                          {edu.startDate}
                          {edu.endDate && ` - ${edu.endDate}`}
                        </span>
                      )}
                      {edu.location && <span> | {edu.location}</span>}
                    </div>
                  </div>
                  
                  {edu.gpa && (
                    <p className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {/* Projects */}
        {resumeData.projects.some(proj => proj.name) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Projects</h2>
            
            {resumeData.projects
              .filter(proj => proj.name)
              .map((project, index) => (
                <div key={project.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium">
                        {project.name}
                        {project.link && (
                          <span className="text-blue-600 ml-1 text-sm">
                            (<a href={project.link} target="_blank" rel="noopener noreferrer">Link</a>)
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    {(project.startDate || project.endDate) && (
                      <div className="text-sm text-gray-600">
                        {project.startDate && (
                          <span>
                            {project.startDate}
                            {project.endDate && ` - ${project.endDate}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                  )}
                  
                  {project.technologies && project.technologies.some(t => t) && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Technologies:</span> {project.technologies.filter(t => t).join(", ")}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.some(cert => cert.name) && (
          <div>
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Certifications</h2>
            
            {resumeData.certifications
              .filter(cert => cert.name)
              .map((cert, index) => (
                <div key={cert.id} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium">
                        {cert.name}
                        {cert.link && (
                          <span className="text-blue-600 ml-1 text-sm">
                            (<a href={cert.link} target="_blank" rel="noopener noreferrer">Verify</a>)
                          </span>
                        )}
                      </h3>
                      {cert.issuer && <p className="text-sm text-gray-700">Issued by {cert.issuer}</p>}
                    </div>
                    {cert.date && <div className="text-sm text-gray-600">{cert.date}</div>}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview; 