import { NextResponse } from 'next/server';
import { runPointWise } from '@/app/components/api/interviewService';

export async function POST(request) {
  try {
    const { extractedText } = await request.json();

    if (!extractedText) {
      return NextResponse.json(
        { error: "Extracted text is required" },
        { status: 400 }
      );
    }

    const summary = await runPointWise(extractedText);

    if (summary.error) {
      return NextResponse.json(
        { error: summary.error },
        { status: 500 }
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error processing text extraction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process text extraction" },
      { status: 500 }
    );
  }
} 