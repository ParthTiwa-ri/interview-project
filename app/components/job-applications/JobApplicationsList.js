"use client";

import Link from 'next/link';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';

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

// Format status for display
const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

export default function JobApplicationsList({ applications, onDelete, onToggleFavorite }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {applications.map((application) => (
          <li key={application.id} className="hover:bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
              {/* Main application info */}
              <div className="flex-grow">
                <Link 
                  href={`/job-applications/${application.id}`} 
                  className="block"
                >
                  <div className="flex items-start">
                    {/* Favorite star */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(application.id, application.isFavorite);
                      }}
                      className="mr-2 text-gray-400 hover:text-yellow-500"
                      aria-label={application.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {application.isFavorite ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.position}
                      </h3>
                      <p className="text-gray-600">{application.company}</p>
                      
                      <div className="flex flex-wrap items-center mt-1 gap-2">
                        {/* Status badge */}
                        {application.status && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[application.status] || 'bg-gray-100'}`}>
                            {formatStatus(application.status)}
                          </span>
                        )}
                        
                        {/* Location */}
                        {application.location && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {application.location} {application.isRemote && "(Remote)"}
                          </span>
                        )}
                        
                        {/* Salary */}
                        {application.salary && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {application.salary}
                          </span>
                        )}
                      </div>
                      
                      {/* Date info */}
                      <div className="mt-2 text-sm text-gray-500">
                        {application.applicationDate && (
                          <span className="mr-4">
                            Applied: {formatDate(application.applicationDate)}
                          </span>
                        )}
                        {application.deadline && (
                          <span className={
                            new Date(application.deadline) < new Date() 
                              ? 'text-red-500 font-medium' 
                              : ''
                          }>
                            Deadline: {formatDate(application.deadline)} 
                            {new Date(application.deadline) < new Date() && ' (Passed)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                <Link
                  href={`/job-applications/${application.id}/edit`}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(application.id);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-red-700 bg-white hover:bg-red-50 hover:border-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 