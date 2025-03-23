"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UserButton,
  useUser
} from "@clerk/nextjs";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-blue-600">
                InterviewPrep
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/" 
                    ? "border-blue-500 text-gray-900" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/interviews" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/interviews" 
                    ? "border-blue-500 text-gray-900" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Interviews
              </Link>
              <Link 
                href="/about" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/about" 
                    ? "border-blue-500 text-gray-900" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {!isSignedIn ? (
              <div className="flex space-x-4">
                <Link href="/sign-in">
                  <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Sign in
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Sign up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-9 w-9"
                    }
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/" 
                ? "bg-blue-50 border-blue-500 text-blue-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            Home
          </Link>
          <Link
            href="/interviews"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/interviews" 
                ? "bg-blue-50 border-blue-500 text-blue-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            My Interviews
          </Link>
          <Link
            href="/about"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/about" 
                ? "bg-blue-50 border-blue-500 text-blue-700" 
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            About
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            {!isSignedIn ? (
              <div className="flex flex-col space-y-2">
                <Link href="/sign-in">
                  <button className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                    Sign in
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium">
                    Sign up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8"
                    }
                  }}
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    Your Account
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 