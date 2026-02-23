"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      {/* Hero Section - Full Page */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 "></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                StreamMatch
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Connect with like-minded people through live streaming, meaningful
              conversations, and authentic connections.
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/matches"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Discovering
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-8 py-4 border-2 border-pink-500 text-pink-500 dark:text-pink-400 text-lg font-semibold rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300"
                >
                  View Profile
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Started
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/matches"
                  className="inline-flex items-center px-8 py-4 border-2 border-pink-500 text-pink-500 dark:text-pink-400 text-lg font-semibold rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300"
                >
                  Explore
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
