"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

// Custom Aceternity-inspired components
const BackgroundGradient = ({ children, className, ...props }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-px ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="relative bg-gray-900 rounded-3xl p-8">{children}</div>
    </div>
  );
};

const GlowingButton = ({ children, ...props }) => {
  return (
    <button
      className="relative inline-flex h-14 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] hover:scale-105 transition-transform duration-300 shadow-lg"
      {...props}
    >
      <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-900 px-8 py-2 text-white">
        {children}
      </span>
    </button>
  );
};

// Animated text reveal
const RevealText = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800"
    >
      <div className="w-12 h-12 bg-blue-900 text-blue-300 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

const HomePage = () => {
  const { isSignedIn, user } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Hero section */}
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      {/* <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}
      {/* <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div></div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-900 text-blue-300 text-sm font-medium">
            Welcome to InterviewPrep AI
          </div>
        </motion.div>
        
        <RevealText>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Master Your Next Interview
          </h1>
        </RevealText>
        
        <RevealText delay={0.1}>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Practice with AI-powered mock interviews tailored to your specific job role.
            Get instant feedback and improve your interview skills.
          </p>
        </RevealText>
        
        <RevealText delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={isSignedIn ? "/interviews" : "/sign-up"}>
              <GlowingButton>
                {isSignedIn ? "View Your Interviews" : "Get Started for Free"}
              </GlowingButton>
            </Link>
            
            {!isSignedIn && (
              <Link href="/sign-in">
                <button className="inline-flex h-14 items-center justify-center rounded-full border-2 border-blue-400 px-8 py-2 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 transition-colors duration-300">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </RevealText>
        
        {/* Preview image */}
        <BackgroundGradient className="max-w-4xl mx-auto">
          <div className="h-64 sm:h-80 md:h-96 bg-gray-800 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">Interview Interface Preview</p>
          </div>
        </BackgroundGradient>
      </div>
      
      {/* Features section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <RevealText>
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose InterviewPrep AI?</h2>
        </RevealText>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<span className="text-xl">👔</span>}
            title="Role-Specific Questions"
            description="Get interview questions tailored to your specific job role and experience level."
            delay={0.3}
          />
          <FeatureCard
            icon={<span className="text-xl">🤖</span>}
            title="AI-Powered Feedback"
            description="Receive instant, detailed feedback on your answers to help you improve."
            delay={0.4}
          />
          <FeatureCard
            icon={<span className="text-xl">📊</span>}
            title="Performance Analytics"
            description="Track your progress and identify areas for improvement over time."
            delay={0.5}
          />
        </div>
      </div>
      
      {/* Testimonials */}
      <div className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealText>
            <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Users Say</h2>
          </RevealText>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-300 font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Jane Doe</h3>
                  <p className="text-sm text-gray-400">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-300">&quot;This platform helped me prepare for my technical interviews. The AI feedback was remarkably insightful!&quot;</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-300 font-semibold">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">John Smith</h3>
                  <p className="text-sm text-gray-400">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-300">&quot;I landed my dream job after practicing with InterviewPrep AI. The tailored questions and feedback were game-changers.&quot;</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <RevealText>
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Ace Your Next Interview?</h2>
        </RevealText>
        
        <RevealText delay={0.1}>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of job seekers who have improved their interview skills and landed their dream jobs.
          </p>
        </RevealText>
        
        <RevealText delay={0.2}>
          <Link href={isSignedIn ? "/interviews" : "/sign-up"}>
            <GlowingButton>
              {isSignedIn ? "Start Practicing Now" : "Get Started for Free"}
            </GlowingButton>
          </Link>
        </RevealText>
      </div>
    </div>
  );
};

export default HomePage;