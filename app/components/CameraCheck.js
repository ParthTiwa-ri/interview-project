"use client";

import { useInterviewContext } from "../context/InterviewContext";
import FaceDetection from "./FaceDetection";
import { AlertTriangle, Camera } from 'lucide-react';

const CameraCheck = () => {
  const { 
    jobRole,
    loading,
    error,
    handleCameraReady,
    cameraReady,
    questionsGenerated
  } = useInterviewContext();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
        <h2 className="text-2xl font-bold text-center mb-6">Camera Check</h2>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Camera className="text-blue-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Camera Setup</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                Please make sure your camera is working properly and your face is clearly visible.
                The interview will start automatically once:
              </p>
              
              <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
                <li>Camera permission is granted</li>
                <li>Face detection models are loaded</li>
                <li>Your face is detected in the camera</li>
              </ul>
              
              <div className="border-t border-gray-200 pt-4 text-sm">
                <p className="text-gray-500">
                  During the interview, please keep facing the camera. Looking away for too long may affect your interview.
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center">
            <div className="relative w-64 h-48 bg-gray-100 rounded-lg border-2 border-blue-500 overflow-hidden">
              <FaceDetection 
                onMaxWarningsReached={() => {}} 
                onReady={handleCameraReady} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {!cameraReady && (
                  <div className="p-3 bg-white bg-opacity-80 rounded-lg shadow-md">
                    <div className="animate-pulse flex space-x-2 items-center">
                      <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                      <div className="h-3 w-3 bg-blue-600 rounded-full animation-delay-200"></div>
                      <div className="h-3 w-3 bg-blue-600 rounded-full animation-delay-500"></div>
                      <span className="text-sm font-medium text-gray-700">Waiting for camera...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="w-full max-w-md bg-red-50 p-4 rounded-lg text-red-600">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4">
            <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${cameraReady ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {cameraReady 
                ? 'Camera ready! Starting interview...' 
                : 'Waiting for camera...'
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        Preparing to interview for: <span className="font-medium text-gray-700">{jobRole}</span>
      </div>
    </div>
  );
};

export default CameraCheck; 