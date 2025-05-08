"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import JobApplicationForm from '../../components/job-applications/JobApplicationForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function NewJobApplicationPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  // Check if user is authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Job Application</h1>
        <p className="text-gray-600">Track a new job opportunity by filling out the form below.</p>
      </div>
      
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <JobApplicationForm />
      </div>
    </div>
  );
} 