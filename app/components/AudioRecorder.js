"use client";

import { useState, useEffect, useRef } from "react";
import { useInterviewContext } from "../context/InterviewContext";
import { Mic } from 'lucide-react';

const AudioRecorder = ({ questionId, onAnswerChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const { answers } = useInterviewContext();
  const transcriptRef = useRef("");
  const currentQuestionIdRef = useRef(questionId);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window)) {
      setError("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false; // Only get final results
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const newText = event.results[current][0].transcript;
      
      // Get current answer for this question
      const currentAnswer = transcriptRef.current;
      
      // Append new text to current answer
      const updatedAnswer = currentAnswer ? `${currentAnswer} ${newText}` : newText;
      
      transcriptRef.current = updatedAnswer;
      setTranscript(updatedAnswer);
      onAnswerChange(currentQuestionIdRef.current, updatedAnswer);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error === 'aborted') {
        // Ignore aborted errors as they're expected when stopping
        return;
      }
      setError(`Speech recognition error: ${event.error}`);
      if (event.error === 'no-speech') {
        // Ignore no-speech errors as they're common
        setError(null);
      }
    };

    recognitionInstance.onend = () => {
      // If we're still in recording state but recognition ended, restart it
      if (isRecording) {
        try {
          recognitionInstance.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognitionInstance;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []); // Empty dependency array as we only want to initialize once

  // Handle question changes
  useEffect(() => {
    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsRecording(false);
    }

    // Update current question ID
    currentQuestionIdRef.current = questionId;

    // Initialize transcript with existing answer for the new question
    const currentAnswer = answers[questionId] || "";
    setTranscript(currentAnswer);
    transcriptRef.current = currentAnswer;
  }, [questionId, answers]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setError(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Failed to start recording. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setError('Failed to stop recording. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRecording ? (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
              Stop Recording
            </div>
          ) : <div className="flex items-center gap-2"><Mic size={20}/>Start Recording</div>}
        </button>
      </div>

      {transcript && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Your Answer:</div>
            <p className="text-gray-900 whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder; 