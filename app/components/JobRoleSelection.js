"use client";

import { useInterviewContext } from "../context/InterviewContext";
import Navbar from "./Navbar";
import { useState } from "react";

const JobRoleSelection = () => {
  const { 
    jobRole, 
    setJobRole, 
    startInterview, 
    loading, 
    error, 
    user,
    isLoaded
  } = useInterviewContext();

  // Common job roles in tech
  const commonJobRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Product Manager",
    "UX Designer",
    "QA Engineer",
    "Mobile Developer",
    "Cloud Architect",
  ];

  // Experience levels
  const experienceLevels = ["Entry Level", "Mid-Level", "Senior", "Lead"];
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [customRole, setCustomRole] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Company and industry
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("Technology");
  
  // Common industries
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Education",
    "Government",
    "Entertainment",
    "Manufacturing",
    "Consulting",
    "Energy"
  ];

  // Handle job role selection
  const handleRoleSelect = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomInput(true);
      setJobRole(customRole);
    } else {
      setShowCustomInput(false);
      setJobRole(value);
    }
  };

  // Handle custom role input
  const handleCustomRoleChange = (e) => {
    const value = e.target.value;
    setCustomRole(value);
    setJobRole(value);
  };

  // Handle interview start with experience level
  const handleStartInterview = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('experienceLevel', experienceLevel);
      localStorage.setItem('industry', industry);
      localStorage.setItem('company', company);
    }
    startInterview(experienceLevel, industry, company);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Mock Interview Preparation</h2>
              <p className="text-gray-600 mt-1">Simulate a real interview experience tailored to your career goals</p>
            </div>
            {isLoaded && user && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Logged in as</div>
                  <div className="font-medium text-gray-900">{user?.firstName}</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="job-role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What role are you interviewing for?
              </label>
              <select
                id="job-role"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={showCustomInput ? "custom" : jobRole}
                onChange={handleRoleSelect}
              >
                <option value="">Select a role</option>
                {commonJobRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
                <option value="custom">Other (specify)</option>
              </select>
              
              {showCustomInput && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={customRole}
                    onChange={handleCustomRoleChange}
                    placeholder="Enter your job role"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="experience-level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Experience Level
                </label>
                <select
                  id="experience-level"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  {experienceLevels.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Industry
                </label>
                <select
                  id="industry"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  {industries.map((ind, index) => (
                    <option key={index} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company (Optional)
              </label>
              <input
                id="company"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Amazon, Microsoft"
              />
              <p className="mt-1 text-xs text-gray-500">Specifying a company will tailor questions to that company&apos;s known interview style</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handleStartInterview}
              disabled={loading || !jobRole}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing Your Interview...
                </div>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">Your interview will include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Role-specific technical questions</li>
              <li>Behavioral questions tailored to your experience level</li>
              <li>Problem-solving scenarios</li>
              <li>{company ? `Questions specific to ${company}'s interview style` : 'Industry-relevant questions'}</li>
              <li>Feedback on your responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRoleSelection; 
// "use client";

// import { useInterviewContext } from "../context/InterviewContext";
// import Navbar from "./Navbar";
// import { useState } from "react";

// const JobRoleSelection = () => {
//   const { 
//     jobRole, 
//     setJobRole, 
//     startInterview, 
//     loading, 
//     error, 
//     user,
//     isLoaded
//   } = useInterviewContext();

//   // Common job roles in tech
//   const commonJobRoles = [
//     "Software Engineer",
//     "Frontend Developer",
//     "Backend Developer",
//     "Full Stack Developer",
//     "DevOps Engineer",
//     "Data Scientist",
//     "Machine Learning Engineer",
//     "Product Manager",
//     "UX Designer",
//     "QA Engineer",
//     "Mobile Developer",
//     "Cloud Architect",
//   ];

//   // Experience levels
//   const experienceLevels = ["Entry Level", "Mid-Level", "Senior", "Lead"];
//   const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
//   const [customRole, setCustomRole] = useState("");
//   const [showCustomInput, setShowCustomInput] = useState(false);
  
//   // Company and industry
//   const [company, setCompany] = useState("");
//   const [industry, setIndustry] = useState("Technology");
  
//   // Common industries
//   const industries = [
//     "Technology",
//     "Finance",
//     "Healthcare",
//     "E-commerce",
//     "Education",
//     "Government",
//     "Entertainment",
//     "Manufacturing",
//     "Consulting",
//     "Energy"
//   ];

//   // Handle job role selection
//   const handleRoleSelect = (e) => {
//     const value = e.target.value;
//     if (value === "custom") {
//       setShowCustomInput(true);
//       setJobRole(customRole);
//     } else {
//       setShowCustomInput(false);
//       setJobRole(value);
//     }
//   };

//   // Handle custom role input
//   const handleCustomRoleChange = (e) => {
//     const value = e.target.value;
//     setCustomRole(value);
//     setJobRole(value);
//   };

//   // Handle interview start with experience level
//   const handleStartInterview = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('experienceLevel', experienceLevel);
//       localStorage.setItem('industry', industry);
//       localStorage.setItem('company', company);
//     }
//     startInterview(experienceLevel, industry, company);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-bold text-white">Mock Interview Preparation</h2>
//               <p className="text-gray-400 mt-1">Simulate a real interview experience tailored to your career goals</p>
//             </div>
//             {isLoaded && user && (
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center">
//                   <span className="text-indigo-300 font-semibold">
//                     {user?.firstName?.charAt(0)}
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-gray-400">Logged in as</div>
//                   <div className="font-medium text-gray-200">{user?.firstName}</div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             <div>
//               <label
//                 htmlFor="job-role"
//                 className="block text-sm font-medium text-gray-300 mb-2"
//               >
//                 What role are you interviewing for?
//               </label>
//               <select
//                 id="job-role"
//                 className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                 value={showCustomInput ? "custom" : jobRole}
//                 onChange={handleRoleSelect}
//               >
//                 <option value="">Select a role</option>
//                 {commonJobRoles.map((role, index) => (
//                   <option key={index} value={role}>
//                     {role}
//                   </option>
//                 ))}
//                 <option value="custom">Other (specify)</option>
//               </select>
              
//               {showCustomInput && (
//                 <div className="mt-3">
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                     value={customRole}
//                     onChange={handleCustomRoleChange}
//                     placeholder="Enter your job role"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="experience-level"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Experience Level
//                 </label>
//                 <select
//                   id="experience-level"
//                   className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   value={experienceLevel}
//                   onChange={(e) => setExperienceLevel(e.target.value)}
//                 >
//                   {experienceLevels.map((level, index) => (
//                     <option key={index} value={level}>
//                       {level}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label
//                   htmlFor="industry"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Industry
//                 </label>
//                 <select
//                   id="industry"
//                   className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   value={industry}
//                   onChange={(e) => setIndustry(e.target.value)}
//                 >
//                   {industries.map((ind, index) => (
//                     <option key={index} value={ind}>
//                       {ind}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div>
//               <label
//                 htmlFor="company"
//                 className="block text-sm font-medium text-gray-300 mb-2"
//               >
//                 Company (Optional)
//               </label>
//               <input
//                 id="company"
//                 type="text"
//                 className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                 value={company}
//                 onChange={(e) => setCompany(e.target.value)}
//                 placeholder="e.g., Google, Amazon, Microsoft"
//               />
//               <p className="mt-1 text-xs text-gray-400">Specifying a company will tailor questions to that company&apos;s known interview style</p>
//             </div>

//             {error && (
//               <div className="p-4 bg-red-900/30 text-red-300 border border-red-800 rounded-xl">
//                 {error}
//               </div>
//             )}

//             <button
//               onClick={handleStartInterview}
//               disabled={loading || !jobRole}
//               className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Preparing Your Interview...
//                 </div>
//               ) : (
//                 "Start Interview"
//               )}
//             </button>
//           </div>

//           <div className="mt-6 pt-6 border-t border-gray-700">
//             <p className="mb-2 text-gray-300 text-sm">Your interview will include:</p>
//             <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//               <li className="flex items-center text-gray-400">
//                 <svg className="w-4 h-4 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                 </svg>
//                 Role-specific technical questions
//               </li>
//               <li className="flex items-center text-gray-400">
//                 <svg className="w-4 h-4 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                 </svg>
//                 Behavioral questions for your level
//               </li>
//               <li className="flex items-center text-gray-400">
//                 <svg className="w-4 h-4 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                 </svg>
//                 Problem-solving scenarios
//               </li>
//               <li className="flex items-center text-gray-400">
//                 <svg className="w-4 h-4 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                 </svg>
//                 {company ? `Questions specific to ${company}'s style` : 'Industry-relevant questions'}
//               </li>
//               <li className="flex items-center text-gray-400">
//                 <svg className="w-4 h-4 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                 </svg>
//                 Feedback on your responses
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobRoleSelection;