"use client";

export default function LoadingSpinner({ size = "medium" }) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4"
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-blue-600 animate-spin`}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
} 