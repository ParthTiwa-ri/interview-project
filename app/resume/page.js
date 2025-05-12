"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ResumeForm from '../components/resume/ResumeForm';
import ResumePreview from '../components/resume/ResumePreview';
import { getEmptyResumeData } from '../utils/resumeUtils';
import { resumeToCoverLetter } from '../utils/coverLetterUtils';

export default function ResumePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [resumeData, setResumeData] = useState(getEmptyResumeData());
  const [isEditing, setIsEditing] = useState(true);
  
  // Redirect if not logged in
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const handleSaveResume = (data) => {
    setResumeData(data);
    setIsEditing(false);
  };
  
  const handleCreateCoverLetter = () => {
    // Store the resume data in localStorage for use in cover letter page
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    router.push('/cover-letter');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Builder</h1>
      
      {isEditing ? (
        <ResumeForm 
          initialData={resumeData} 
          onSave={handleSaveResume}
        />
      ) : (
        <ResumePreview 
          resumeData={resumeData} 
          onEdit={() => setIsEditing(true)}
          onCreateCoverLetter={handleCreateCoverLetter}
        />
      )}
    </div>
  );
} 