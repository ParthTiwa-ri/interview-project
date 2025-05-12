"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import CoverLetterForm from '../components/cover-letter/CoverLetterForm';
import CoverLetterPreview from '../components/cover-letter/CoverLetterPreview';
import { getEmptyCoverLetterData, resumeToCoverLetter } from '../utils/coverLetterUtils';

export default function CoverLetterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [coverLetterData, setCoverLetterData] = useState(getEmptyCoverLetterData());
  const [isEditing, setIsEditing] = useState(true);
  
  // Check for resume data in localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedResumeData = localStorage.getItem('resumeData');
      if (savedResumeData) {
        try {
          const parsedResumeData = JSON.parse(savedResumeData);
          const prefilled = resumeToCoverLetter(parsedResumeData);
          setCoverLetterData(prefilled);
          // Clear the data from localStorage to avoid unexpected prefilling on future visits
          localStorage.removeItem('resumeData');
        } catch (error) {
          console.error('Error parsing resume data:', error);
        }
      }
    }
  }, []);
  
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
  
  const handleSaveCoverLetter = (data) => {
    setCoverLetterData(data);
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 print:hidden">Cover Letter Builder</h1>
      
      {isEditing ? (
        <CoverLetterForm 
          initialData={coverLetterData} 
          onSave={handleSaveCoverLetter}
        />
      ) : (
        <CoverLetterPreview 
          coverLetterData={coverLetterData} 
          onEdit={() => setIsEditing(true)} 
        />
      )}
    </div>
  );
} 