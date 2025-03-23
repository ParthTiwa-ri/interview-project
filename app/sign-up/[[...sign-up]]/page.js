import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-blue-600">InterviewPrep AI</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-gray-600">Join InterviewPrep AI to improve your interview skills</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              footerActionLink: "text-blue-600 hover:text-blue-800",
            },
          }}
          routing="path"
          path="/sign-up"
          redirectUrl="/"
        />
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
} 