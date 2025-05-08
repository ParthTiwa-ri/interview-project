import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '../../lib/mongodb';
import Resume from '../../models/ResumeSchema';
import { cleanResumeData } from '../../utils/resumeUtils';

// POST /api/resume - Create or update a resume
export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to perform this action' },
        { status: 401 }
      );
    }
    
    const { resumeData } = await request.json();
    
    await connectDB();
    
    // Clean the data to remove empty fields
    const cleanedData = cleanResumeData(resumeData);
    
    // Look for an existing resume
    const existingResume = await Resume.findOne({ userId });
    
    if (existingResume) {
      // Update existing resume
      existingResume.resumeData = cleanedData;
      await existingResume.save();
      
      return NextResponse.json(
        { message: 'Resume updated successfully', data: existingResume },
        { status: 200 }
      );
    } else {
      // Create new resume
      const newResume = new Resume({
        userId,
        resumeData: cleanedData
      });
      
      await newResume.save();
      
      return NextResponse.json(
        { message: 'Resume created successfully', data: newResume },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your resume' },
      { status: 500 }
    );
  }
}

// GET /api/resume - Get all resumes (admin only, if needed)
export async function GET(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const resumes = await Resume.find({});
    
    return NextResponse.json(resumes, { status: 200 });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching resumes' },
      { status: 500 }
    );
  }
} 