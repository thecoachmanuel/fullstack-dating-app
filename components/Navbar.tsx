"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <nav className="relative z-50 bg-slate-900 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              StreamMatch
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/matches"
                className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors duration-200"
              >
                Discover
              </Link>
              <Link
                href="/matches/list"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200"
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => {
                  try {
                    navigator?.vibrate?.(10);
                  } catch {}
                  setOpen((v) => !v);
                }}
                aria-label="Open menu"
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
             >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {user ? (
              <button
                onClick={signOut}
                className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {user && (
        <>
          <div
            onClick={() => setOpen(false)}
            className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
            className={`md:hidden fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out will-change-transform ${open ? "translate-y-0 scale-100" : "translate-y-full scale-95"}`}
          >
            <div
              className="bg-slate-900 border-t border-gray-700 rounded-t-2xl shadow-2xl p-4"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-gray-600 mb-4" />
              <div className="space-y-1">
                <Link href="/matches" onClick={() => { try { navigator?.vibrate?.(8); } catch {} setOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800">
                  <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 015.964 12.06l3.243 3.243-1.414 1.414-3.243-3.243A7.5 7.5 0 1110.5 6z" /></svg>
                  <span>Discover</span>
                </Link>
                <Link href="/matches/list" onClick={() => { try { navigator?.vibrate?.(8); } catch {} setOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>
                  <span>Matches</span>
                </Link>
                <Link href="/chat" onClick={() => { try { navigator?.vibrate?.(8); } catch {} setOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800">
                  <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2v10z" /></svg>
                  <span>Messages</span>
                </Link>
                <Link href="/profile" onClick={() => { try { navigator?.vibrate?.(8); } catch {} setOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800">
                  <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 7a4 4 0 110-8 4 4 0 010 8z" transform="translate(0 9)" /></svg>
                  <span>Profile</span>
                </Link>
                <button onClick={() => { try { navigator?.vibrate?.(8); } catch {} setOpen(false); signOut(); }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-gray-800">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 4h6a2 2 0 012 2v3" /></svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
