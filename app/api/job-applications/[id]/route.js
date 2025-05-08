import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * GET /api/job-applications/:id
 * Retrieve a specific job application by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get job application
    const application = await prisma.jobApplication.findUnique({
      where: { id }
    });
    
    // Check if application exists and belongs to user
    if (!application) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    
    if (application.userId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to access this job application' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(application);
  } catch (error) {
    console.error('Error in GET /api/job-applications/:id:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job application' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/job-applications/:id
 * Update a job application (full update)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Validate required fields
    if (!data.company || !data.position) {
      return NextResponse.json(
        { error: 'Company and position are required' },
        { status: 400 }
      );
    }
    
    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if job application exists and belongs to user
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id }
    });
    
    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    
    if (existingApplication.userId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this job application' },
        { status: 403 }
      );
    }
    
    // Update job application
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error in PUT /api/job-applications/:id:', error);
    return NextResponse.json(
      { error: 'Failed to update job application' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/job-applications/:id
 * Update a job application (partial update)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if job application exists and belongs to user
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id }
    });
    
    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    
    if (existingApplication.userId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this job application' },
        { status: 403 }
      );
    }
    
    // Update job application (partial update)
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error in PATCH /api/job-applications/:id:', error);
    return NextResponse.json(
      { error: 'Failed to update job application' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/job-applications/:id
 * Delete a job application
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if job application exists and belongs to user
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id }
    });
    
    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    
    if (existingApplication.userId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this job application' },
        { status: 403 }
      );
    }
    
    // Delete job application
    await prisma.jobApplication.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Job application deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/job-applications/:id:', error);
    return NextResponse.json(
      { error: 'Failed to delete job application' },
      { status: 500 }
    );
  }
} 