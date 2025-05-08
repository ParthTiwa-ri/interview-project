import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * GET /api/job-applications - Get all job applications for authenticated user
 */
export async function GET(request) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Find user in database or create if doesn't exist
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all job applications for this user
    const applications = await prisma.jobApplication.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error in GET /api/job-applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/job-applications - Create a new job application
 */
export async function POST(request) {
  try {
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

    // Create job application
    const jobApplication = await prisma.jobApplication.create({
      data: {
        ...data,
        userId: dbUser.id
      }
    });

    return NextResponse.json(jobApplication, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/job-applications:', error);
    return NextResponse.json(
      { error: 'Failed to create job application' },
      { status: 500 }
    );
  }
} 