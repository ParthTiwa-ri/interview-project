"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import JobApplicationsList from '../components/job-applications/JobApplicationsList';
import JobApplicationsFilters from '../components/job-applications/JobApplicationsFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Available status options for filtering
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' }
];

export default function JobApplicationsPage() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  
  // State for job applications data
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Load job applications from the API
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/job-applications');
        
        if (!response.ok) {
          throw new Error('Failed to fetch job applications');
        }
        
        const data = await response.json();
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        setError('Failed to load job applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [isLoaded, isSignedIn, router]);
  
  // Filter applications based on current filters
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Filter by favorite status if enabled
      if (showFavorites && !app.isFavorite) {
        return false;
      }
      
      // Filter by status if not set to 'all'
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term (position, company, or location)
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          (app.position && app.position.toLowerCase().includes(searchTermLower)) ||
          (app.company && app.company.toLowerCase().includes(searchTermLower)) ||
          (app.location && app.location && app.location.toLowerCase().includes(searchTermLower))
        );
      }
      
      return true;
    });
  }, [applications, statusFilter, searchTerm, showFavorites]);
  
  // Handle application deletion
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job application');
      }
      
      // Remove from state
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error deleting job application:', err);
      alert('Failed to delete job application. Please try again.');
    }
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !currentStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }
      
      // Update state locally
      setApplications(applications.map(app => 
        app.id === id ? { ...app, isFavorite: !app.isFavorite } : app
      ));
    } catch (err) {
      console.error('Error updating favorite status:', err);
      alert('Failed to update favorite status. Please try again.');
    }
  };
  
  if (!isLoaded) {
    return <LoadingSpinner size="large" />;
  }
  
  if (!isSignedIn) {
    // This shouldn't normally be visible since we redirect in useEffect
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
        <Link
          href="/job-applications/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Application
        </Link>
      </div>
      
      <JobApplicationsFilters 
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFavorites={showFavorites}
        onFavoritesToggle={setShowFavorites}
        statusOptions={STATUS_OPTIONS}
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job applications found</h3>
          <p className="text-gray-500 mb-4">
            {applications.length > 0 
              ? 'Try adjusting your filters to see more results.' 
              : 'Start tracking your job applications by adding your first one.'}
          </p>
          {applications.length === 0 && (
            <Link
              href="/job-applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Your First Application
            </Link>
          )}
        </div>
      ) : (
        <JobApplicationsList 
          applications={filteredApplications} 
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      
      {/* Stats Summary */}
      {applications.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-semibold">{applications.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Applied</h3>
            <p className="text-2xl font-semibold">{applications.filter(app => app.status === 'applied').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Interviews</h3>
            <p className="text-2xl font-semibold">
              {applications.filter(app => 
                app.status === 'interview_scheduled' || app.status === 'interview_completed'
              ).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Offers</h3>
            <p className="text-2xl font-semibold">
              {applications.filter(app => app.status === 'offer_received').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 