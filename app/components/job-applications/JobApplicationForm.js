"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../common/LoadingSpinner';

// Status options for the dropdown
const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' }
];

export default function JobApplicationForm({ 
  applicationId = null, 
  initialData = null 
}) {
  const router = useRouter();
  const isEditing = Boolean(applicationId);
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    isRemote: false,
    jobDescription: '',
    applicationDate: '',
    deadline: '',
    status: 'saved',
    salary: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
    isFavorite: false,
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch existing application data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      return;
    }
    
    if (isEditing) {
      fetchApplicationData();
    }
  }, [applicationId, initialData, isEditing]);
  
  // Fetch the application data from the API
  const fetchApplicationData = async () => {
    setIsFetching(true);
    setError('');
    
    try {
      const response = await fetch(`/api/job-applications/${applicationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job application data');
      }
      
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      console.error('Error fetching job application:', err);
      setError('Failed to load job application data. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const url = isEditing 
        ? `/api/job-applications/${applicationId}` 
        : '/api/job-applications';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save job application');
      }
      
      // Redirect to job applications list
      router.push('/job-applications');
      router.refresh();
    } catch (err) {
      console.error('Error saving job application:', err);
      setError(err.message || 'Failed to save job application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Company and Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="company" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label 
            htmlFor="position" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Position <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Location and Remote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="location" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center h-full pt-6">
          <input
            type="checkbox"
            id="isRemote"
            name="isRemote"
            checked={formData.isRemote || false}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label 
            htmlFor="isRemote" 
            className="ml-2 block text-sm text-gray-700"
          >
            Remote position
          </label>
        </div>
      </div>
      
      {/* Status and Application Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="status" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'saved'}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            htmlFor="applicationDate" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Application Date
          </label>
          <input
            type="date"
            id="applicationDate"
            name="applicationDate"
            value={formData.applicationDate || ''}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Deadline and Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="deadline" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline || ''}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label 
            htmlFor="salary" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Salary
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary || ''}
            onChange={handleChange}
            placeholder="e.g. $80,000 - $100,000"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Job Description */}
      <div>
        <label 
          htmlFor="jobDescription" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job Description
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription || ''}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      {/* Contact Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label 
              htmlFor="contactName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName || ''}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="contactEmail" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail || ''}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="contactPhone" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone || ''}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <label 
          htmlFor="notes" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any notes about the application, interviews, follow-ups, etc."
        />
      </div>
      
      {/* Favorite */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFavorite"
          name="isFavorite"
          checked={formData.isFavorite || false}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label 
          htmlFor="isFavorite" 
          className="ml-2 block text-sm text-gray-700"
        >
          Mark as favorite
        </label>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && <LoadingSpinner size="small" className="mr-2" />}
          {isEditing ? 'Update' : 'Create'} Job Application
        </button>
      </div>
    </form>
  );
} 