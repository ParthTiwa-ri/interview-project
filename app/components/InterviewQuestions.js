"use client";

import { useInterviewContext } from "../context/InterviewContext";
import AudioRecorder from "./AudioRecorder";
import FaceDetection from "./FaceDetection";
import Navbar from "./Navbar";
import Link from 'next/link';

const InterviewQuestions = () => {
  const {
    jobRole,
    questions,
    answers,
    handleAnswerChange,
    currentQuestionIndex,
    previousQuestion,
    nextQuestion,
    interviewComplete,
    scoreAllAnswers,
    scoringLoading,
    savingToDb,
    error,
    maxWarningsReached,
    testTerminated,
    handleMaxWarningsReached,
    resetInterview
  } = useInterviewContext();

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div className="text-red-500 p-4">Error: Question not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{jobRole} Interview</h2>
            <p className="text-gray-600 mt-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0 || testTerminated}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion.id]?.trim() || testTerminated}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {testTerminated && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-2">Interview Terminated</h3>
            <p>Your interview has been terminated because you looked away from the screen too many times. 
              Please ensure you are fully focused during interviews.</p>
            <p className="mt-2">You can restart the interview process from the beginning.</p>
            
            <div className="mt-6 flex gap-4">
              {/* <button 
                onClick={resetInterview}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Start New Interview
              </button> */}
              <Link href="/">Go to Home</Link>
            </div>
          </div>
        )}

        {!testTerminated && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <FaceDetection onMaxWarningsReached={handleMaxWarningsReached} />
            </div>
            
            <div className="flex items-start space-x-4 pr-28">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{currentQuestionIndex + 1}</span>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-6">
                  {/* <div className="text-xs text-gray-500 mb-2">
                    Note: You can look at your keyboard while typing/speaking, but try to face the camera when possible.
                  </div> */}
                  <AudioRecorder
                    questionId={currentQuestion.id}
                    onAnswerChange={handleAnswerChange}
                  />

                  {answers[currentQuestion.id] && (
                    <div className="mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Your Answer:</div>
                        <p className="text-gray-900 whitespace-pre-wrap">{answers[currentQuestion.id]}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {interviewComplete && !testTerminated && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h3>

            <div className="space-y-6 mb-8">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900 mb-2">{q.question}</div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">Your Answer:</div>
                        <p className="text-gray-900 whitespace-pre-wrap">{answers[q.id]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={scoreAllAnswers}
              disabled={scoringLoading || savingToDb}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scoringLoading
                ? "Generating Feedback..."
                : savingToDb
                ? "Saving Results..."
                : "Submit All Answers For Feedback"}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions; 