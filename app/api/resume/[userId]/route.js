import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '../../../lib/mongodb';
import Resume from '../../../models/ResumeSchema';

// GET /api/resume/[userId] - Get a specific user's resume
export async function GET(request, { params }) {
  try {
    const { userId: currentUserId } = auth();
    const { userId } = params;
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'You must be signed in to perform this action' },
        { status: 401 }
      );
    }
    
    // Check if the user is requesting their own resume
    if (currentUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only access your own resume' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const resume = await Resume.findOne({ userId });
    
    if (!resume) {
      return NextResponse.json(
        { message: 'No resume found for this user' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(resume.resumeData, { status: 200 });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the resume' },
      { status: 500 }
    );
  }
}

// DELETE /api/resume/[userId] - Delete a user's resume
export async function DELETE(request, { params }) {
  try {
    const { userId: currentUserId } = auth();
    const { userId } = params;
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'You must be signed in to perform this action' },
        { status: 401 }
      );
    }
    
    // Check if the user is deleting their own resume
    if (currentUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own resume' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const result = await Resume.deleteOne({ userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'No resume found to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Resume deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the resume' },
      { status: 500 }
    );
  }
} 