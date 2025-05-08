"use client";

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import JobApplicationForm from '../../../components/job-applications/JobApplicationForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function EditJobApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  
  // Check authentication and fetch data
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/job-applications/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Job application not found');
          }
          throw new Error('Failed to fetch job application');
        }
        
        const data = await response.json();
        setApplication(data);
      } catch (err) {
        console.error('Error fetching job application:', err);
        setError(err.message || 'Failed to load job application data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [id, isLoaded, isSignedIn, router]);
  
  if (!isLoaded) {
    return <LoadingSpinner size="large" />;
  }
  
  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
        <div className="flex justify-center">
          <Link
            href="/job-applications"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Job Applications
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Job Application</h1>
        <p className="text-gray-600">Update the details for your job application.</p>
      </div>
      
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <JobApplicationForm 
          applicationId={id}
          initialData={application}
        />
      </div>
    </div>
  );
} 