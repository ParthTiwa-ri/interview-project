// JobApplicationSchema.js
// This defines the structure of a job application in our application

import mongoose from 'mongoose';

// Define available status options
export const APPLICATION_STATUS = {
  SAVED: 'saved',
  APPLIED: 'applied',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEW_COMPLETED: 'interview_completed',
  OFFER_RECEIVED: 'offer_received',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  DECLINED: 'declined'
};

// Define the schema
const JobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    isRemote: {
      type: Boolean,
      default: false
    },
    jobDescription: {
      type: String,
      trim: true
    },
    applicationDate: {
      type: String // Store as YYYY-MM-DD format
    },
    deadline: {
      type: String // Store as YYYY-MM-DD format
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SAVED
    },
    salary: {
      type: String,
      trim: true
    },
    contactName: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    // Add any other properties as needed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Only register the model once
const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;

// Helper function to generate IDs for new applications
export const generateId = () => `job-${Date.now()}`;

// Helper function to generate new task ID
export const generateTaskId = () => `task-${Date.now()}`;

// Helper function to format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to create a new status history entry
export const createStatusEntry = (status, notes = "") => {
  return {
    status,
    date: formatDate(new Date()),
    notes
  };
};

// Create a new job application
export const createJobApplication = (data = {}) => {
  const now = new Date();
  const id = generateId();
  
  return {
    ...defaultJobApplication,
    ...data,
    id,
    statusHistory: [
      createStatusEntry(data.status || APPLICATION_STATUS.SAVED, "Application created")
    ]
  };
}; 