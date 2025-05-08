"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';

// Format status for display
const formatStatus = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : '';
};

// Status colors for badges
const STATUS_COLORS = {
  saved: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  interview_scheduled: 'bg-purple-100 text-purple-800',
  interview_completed: 'bg-indigo-100 text-indigo-800',
  offer_received: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  declined: 'bg-amber-100 text-amber-800'
};

export default function JobApplicationDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  
  // State
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch job application data
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    const fetchApplicationData = async () => {
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
    
    fetchApplicationData();
  }, [id, isLoaded, isSignedIn, router]);
  
  // Handle delete application
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job application? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job application');
      }
      
      // Redirect to job applications list
      router.push('/job-applications');
    } catch (err) {
      console.error('Error deleting job application:', err);
      setError('Failed to delete job application. Please try again later.');
      setLoading(false);
    }
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !application.isFavorite
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      
      // Update state locally
      setApplication({
        ...application,
        isFavorite: !application.isFavorite
      });
    } catch (err) {
      console.error('Error updating favorite status:', err);
      alert('Failed to update favorite status. Please try again.');
    }
  };
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!isSignedIn) {
    return null; // Will redirect in the useEffect
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
  
  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6">
          Job application not found
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
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 mr-2">
              {application.position}
            </h1>
            <button
              onClick={handleToggleFavorite}
              className="text-gray-400 hover:text-yellow-500"
              aria-label={application.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {application.isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-lg text-gray-600">{application.company}</p>
          {application.location && (
            <p className="text-gray-500">
              {application.location}
              {application.isRemote && " (Remote)"}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link
            href="/job-applications"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href={`/job-applications/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Status and dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Status</h2>
          <div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'}`}>
              {formatStatus(application.status)}
            </span>
          </div>
        </div>
        
        {application.applicationDate && (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Applied On</h2>
            <p className="text-gray-900">
              {formatDate(application.applicationDate)}
              <span className="text-gray-500 text-xs ml-2">
                ({getRelativeTime(application.applicationDate)})
              </span>
            </p>
          </div>
        )}
        
        {application.deadline && (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Deadline</h2>
            <p className={`text-gray-900 ${getRelativeTime(application.deadline) === 'Today' ? 'font-semibold' : ''}`}>
              {formatDate(application.deadline)}
              <span className={`text-xs ml-2 ${
                new Date(application.deadline) < new Date() 
                  ? 'text-red-500' 
                  : 'text-gray-500'
              }`}>
                ({getRelativeTime(application.deadline)})
              </span>
            </p>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2">
          {/* Job description */}
          {application.jobDescription && (
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                {application.jobDescription.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {application.notes && (
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                {application.notes.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Salary */}
          {application.salary && (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Salary</h2>
              <p className="text-gray-900">{application.salary}</p>
            </div>
          )}
          
          {/* Contact information */}
          {(application.contactName || application.contactEmail || application.contactPhone) && (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-md font-medium text-gray-900 mb-3">Contact Information</h2>
              
              {application.contactName && (
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-gray-900">{application.contactName}</p>
                </div>
              )}
              
              {application.contactEmail && (
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <a href={`mailto:${application.contactEmail}`} className="text-blue-600 hover:underline">
                    {application.contactEmail}
                  </a>
                </div>
              )}
              
              {application.contactPhone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <a href={`tel:${application.contactPhone}`} className="text-blue-600 hover:underline">
                    {application.contactPhone}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Quick actions */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {application.contactEmail && (
                <a
                  href={`mailto:${application.contactEmail}`}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              )}
              <Link
                href={`/job-applications/${id}/edit`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Status
              </Link>
              <button
                onClick={handleToggleFavorite}
                className="flex items-center text-blue-600 hover:text-blue-800 w-full text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${application.isFavorite ? 'text-yellow-500' : ''}`} fill={application.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {application.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 