"use client";

import { jsPDF } from 'jspdf';

// Add print-specific styles to handle color functions
const addPrintStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      * {
        color: #000 !important;
        background: #fff !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .bg-white {
        background-color: #ffffff !important;
      }
      .text-gray-600 {
        color: #4b5563 !important;
      }
      .text-gray-700 {
        color: #374151 !important;
      }
      .text-gray-800 {
        color: #1f2937 !important;
      }
      .text-blue-600 {
        color: #2563eb !important;
      }
      .border-gray-200 {
        border-color: #e5e7eb !important;
      }
      .border-gray-300 {
        border-color: #d1d5db !important;
      }
    }
  `;
  document.head.appendChild(style);
  return style;
};

/**
 * Generates a PDF from an HTML element
 * @param {string} elementId - The ID of the HTML element to convert to PDF
 * @param {Object} resumeData - The resume data to convert to PDF
 * @param {string} filename - The filename for the PDF
 */
export const generatePDF = async (elementId, resumeData, filename = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Setup font
    pdf.setFont('helvetica');
    
    // Helper function to add text with wrapping
    const addText = (text, x, y, maxWidth) => {
      if (!text) return 0;
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      pdf.text(lines, x, y);
      return lines.length * 7; // Approximate line height
    };

    // Helper function to add centered text
    const addCenteredText = (text, y, fontSize) => {
      if (!text) return 0;
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(fontSize || 12);
      const lines = pdf.splitTextToSize(text.toString(), pageWidth - 40);
      pdf.text(lines, pageWidth / 2, y, { align: 'center' });
      return lines.length * (fontSize / 2); // Approximate line height based on font size
    };

    // Helper to draw a horizontal line
    const addHorizontalLine = (y) => {
      pdf.setDrawColor(210, 210, 210);
      pdf.line(20, y, pdf.internal.pageSize.getWidth() - 20, y);
      return y + 5; // Reduced spacing to match web version
    };
    
    // Page margins and positioning
    const leftMargin = 20; // Left margin in mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (leftMargin * 2);
    let y = 30; // Starting y position
    
    // Name - centered, large font size
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const nameHeight = addCenteredText(resumeData.personalInfo.name, y, 24);
    y += nameHeight + 10;
    
    // Contact details on one line, centered with proper spacing
    let contactLine = '';
    
    if (resumeData.personalInfo.phone) {
      contactLine += resumeData.personalInfo.phone;
    }
    
    // Add address with proper spacing
    if (resumeData.personalInfo.address) {
      if (contactLine) contactLine += '     '; // Extra space for separation
      contactLine += resumeData.personalInfo.address;
    }
    
    // Add LinkedIn with proper spacing
    if (resumeData.personalInfo.linkedin) {
      if (contactLine) contactLine += '     '; // Extra space for separation
      contactLine += resumeData.personalInfo.linkedin;
    }
    
    if (contactLine) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      addCenteredText(contactLine, y, 11);
      y += 12;
    }
    
    y = addHorizontalLine(y);
    
    // Professional Summary section
    y += 10;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Professional Summary', leftMargin, y);
    y += 5; // Reduced spacing to match web version
    
    y = addHorizontalLine(y);
    y += 5;
    
    if (resumeData.personalInfo.objective) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      y += addText(resumeData.personalInfo.objective, leftMargin, y, contentWidth);
    } else {
      // If no objective, add a placeholder or default text
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      y += addText('Web developer', leftMargin, y, contentWidth);
    }
    
    y += 10;
    
    // Check for experience - we want to match the web version's section order
    const hasExperience = resumeData.experience?.some(exp => exp.company || exp.position);
    if (hasExperience) {
      y = addHorizontalLine(y);
      y += 10;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Experience', leftMargin, y);
      y += 5; // Reduced spacing to match web version
      
      y = addHorizontalLine(y);
      y += 5;
      
      resumeData.experience
        .filter(exp => exp.company || exp.position)
        .forEach(exp => {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          
          // Position
          if (exp.position) {
            const position = exp.position;
            
            // Check if we need to add location on the same line
            if (exp.location) {
              // Calculate position width to place location on the right
              const posWidth = pdf.getStringUnitWidth(position) * 12 / pdf.internal.scaleFactor;
              pdf.text(position, leftMargin, y);
              
              // Add location right-aligned with | separator
              pdf.setFont('helvetica', 'normal');
              const locationText = `| ${exp.location}`;
              pdf.text(locationText, pageWidth - leftMargin, y, { align: 'right' });
              y += 7;
            } else {
              y += addText(position, leftMargin, y, contentWidth);
            }
          }
          
          // Company
          pdf.setFont('helvetica', 'normal');
          if (exp.company) {
            y += addText(exp.company, leftMargin, y, contentWidth);
          }
          
          // Date range
          let dateRange = '';
          if (exp.startDate) {
            dateRange = exp.startDate;
            if (exp.endDate) dateRange += ` - ${exp.endDate}`;
            y += addText(dateRange, leftMargin, y, contentWidth);
          }
          
          // Description
          if (exp.description) {
            y += addText(exp.description, leftMargin, y, contentWidth);
          }
          
          // Achievements
          if (exp.achievements && exp.achievements.some(a => a)) {
            exp.achievements.filter(a => a).forEach(achievement => {
              y += addText(`• ${achievement}`, leftMargin + 5, y, contentWidth - 5);
            });
          }
          
          y += 8;
        });
    }
    
    // Education section
    const hasEducation = resumeData.education?.some(edu => edu.institution || edu.degree);
    if (hasEducation) {
      y = addHorizontalLine(y);
      y += 10;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Education', leftMargin, y);
      y += 5; // Reduced spacing to match web version
      
      y = addHorizontalLine(y);
      y += 5;
      
      resumeData.education
        .filter(edu => edu.institution || edu.degree)
        .forEach(edu => {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          
          // Degree and field
          if (edu.degree) {
            let degreeText = edu.degree;
            if (edu.field) degreeText += ` in ${edu.field}`;
            y += addText(degreeText, leftMargin, y, contentWidth);
          }
          
          // Institution
          pdf.setFont('helvetica', 'normal');
          if (edu.institution) {
            y += addText(edu.institution, leftMargin, y, contentWidth);
          }
          
          // GPA if available
          if (edu.gpa) {
            y += addText(`GPA: ${edu.gpa}`, leftMargin, y, contentWidth);
          }
          
          // Show date range only if present
          if (edu.startDate || edu.endDate) {
            let dateRange = '';
            if (edu.startDate) dateRange = edu.startDate;
            if (edu.endDate) {
              if (dateRange) dateRange += ` - ${edu.endDate}`;
              else dateRange = edu.endDate;
            }
            if (dateRange) y += addText(dateRange, leftMargin, y, contentWidth);
          }
          
          y += 8;
        });
    }
    
    // Skills section if present (only shown if in the web version)
    const hasSkills = resumeData.skills?.technical?.some(skill => skill) || 
                     resumeData.skills?.soft?.some(skill => skill) || 
                     resumeData.skills?.languages?.some(skill => skill);
    
    if (hasSkills) {
      y = addHorizontalLine(y);
      y += 10;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Skills', leftMargin, y);
      y += 5; // Reduced spacing to match web version
      
      y = addHorizontalLine(y);
      y += 5;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      if (resumeData.skills?.technical?.some(skill => skill)) {
        const techSkills = resumeData.skills.technical.filter(skill => skill).join(", ");
        y += addText(techSkills, leftMargin, y, contentWidth);
        y += 5;
      }
    }
    
    // Projects section
    const hasProjects = resumeData.projects?.some(proj => proj.name);
    if (hasProjects) {
      y = addHorizontalLine(y);
      y += 10;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Projects', leftMargin, y);
      y += 5; // Reduced spacing to match web version
      
      y = addHorizontalLine(y);
      y += 5;
      
      resumeData.projects
        .filter(proj => proj.name)
        .forEach(project => {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          
          if (project.name) {
            y += addText(project.name, leftMargin, y, contentWidth);
          }
          
          pdf.setFont('helvetica', 'normal');
          
          // Date range
          if (project.startDate || project.endDate) {
            let dateText = '';
            if (project.startDate) dateText += project.startDate;
            if (project.endDate) {
              if (project.startDate) dateText += ` - ${project.endDate}`;
              else dateText = project.endDate;
            }
            
            if (dateText) {
              y += addText(dateText, leftMargin, y, contentWidth);
            }
          }
          
          // Description
          if (project.description) {
            y += addText(project.description, leftMargin, y, contentWidth);
          }
          
          // Technologies
          if (project.technologies && project.technologies.some(t => t)) {
            const techText = `Technologies: ${project.technologies.filter(t => t).join(", ")}`;
            y += addText(techText, leftMargin, y, contentWidth);
          }
          
          // Link
          if (project.link) {
            y += addText(`Link: ${project.link}`, leftMargin, y, contentWidth);
          }
          
          y += 8;
        });
    }
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generates a PDF from an interview report
 * @param {Object} interviewData - The interview data
 * @param {string} filename - The filename for the PDF
 */
export const generateInterviewPDF = async (interviewData, filename) => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.display = 'none';
  
  // Create the HTML content for the PDF
  container.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #2563eb; text-align: center;">Interview Report</h1>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Interview Details</h2>
        <p><strong>Job Role:</strong> ${interviewData.jobRole || 'Not specified'}</p>
        <p><strong>Date:</strong> ${new Date(interviewData.date).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> ${interviewData.duration || 'Not recorded'} minutes</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Performance Summary</h2>
        <p><strong>Overall Score:</strong> ${interviewData.overallScore || 'N/A'}/100</p>
        <p><strong>Technical Knowledge:</strong> ${interviewData.technicalScore || 'N/A'}/100</p>
        <p><strong>Communication:</strong> ${interviewData.communicationScore || 'N/A'}/100</p>
        <p><strong>Confidence:</strong> ${interviewData.confidenceScore || 'N/A'}/100</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Questions & Answers</h2>
        ${(interviewData.questions || []).map((q, index) => `
          <div style="margin-bottom: 15px; padding: 10px; background-color: ${index % 2 === 0 ? '#f8fafc' : '#fff'};">
            <p><strong>Q${index + 1}:</strong> ${q.question}</p>
            <p><strong>Your Answer:</strong> ${q.answer || 'No answer provided'}</p>
            <p><strong>Feedback:</strong> ${q.feedback || 'No feedback available'}</p>
            <p><strong>Score:</strong> ${q.score || 'N/A'}/100</p>
          </div>
        `).join('')}
      </div>
      
      <div>
        <h2 style="color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Recommendations</h2>
        <ul>
          ${(interviewData.recommendations || ['No specific recommendations available.']).map(rec => `
            <li style="margin-bottom: 5px;">${rec}</li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
  
  // Add to the document
  document.body.appendChild(container);
  
  try {
    // Generate PDF
    await generatePDF(container, resumeData, filename);
    return true;
  } catch (error) {
    console.error('Error generating interview PDF:', error);
    return false;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

/**
 * Exports resume data to a JSON file
 * @param {Object} resumeData - The resume data to export
 * @param {string} filename - The filename for the JSON file
 */
export const downloadResumeJSON = (resumeData, filename) => {
  try {
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading resume JSON:', error);
    return false;
  }
};

export const generateJSON = (data, filename = 'resume.json') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating JSON:', error);
    throw error;
  }
}; 