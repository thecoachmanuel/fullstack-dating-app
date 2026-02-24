"use client";

import { getUserMatches } from "@/lib/actions/matches";
import { useEffect, useState } from "react";
import { UserProfile } from "../profile/page";
import Link from "next/link";

interface ChatData {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateIds, setAnimateIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const cached = typeof window !== "undefined" ? window.sessionStorage.getItem("recentChats") : null;
      if (cached) {
        const parsed = JSON.parse(cached) as ChatData[];
        setChats(parsed);
        setLoading(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        const chatData: ChatData[] = userMatches.map((match) => ({
          id: match.id,
          user: match,
          lastMessage: "Start your conversation!",
          lastMessageTime: match.created_at,
          unreadCount: 0,
        }));
        setChats(chatData);
        try { window.sessionStorage.setItem("recentChats", JSON.stringify(chatData.slice(0, 10))); } catch {}
        console.log(userMatches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  useEffect(() => {
    function onNewMatch(e: Event) {
      const detail = (e as CustomEvent<UserProfile>).detail;
      if (!detail) return;
      setChats((prev) => {
        if (prev.some((c) => c.id === detail.id)) return prev;
        const newChat: ChatData = {
          id: detail.id,
          user: detail,
          lastMessage: "Start your conversation!",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        };
        const next = [newChat, ...prev].slice(0, 10);
        try { window.sessionStorage.setItem("recentChats", JSON.stringify(next)); } catch {}
        return next;
      });
      setAnimateIds((prev) => new Set(prev).add(detail.id));
      setTimeout(() => {
        setAnimateIds((prev) => {
          const next = new Set(prev);
          next.delete(detail.id);
          return next;
        });
      }, 600);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("new-match", onNewMatch as EventListener);
      return () => window.removeEventListener("new-match", onNewMatch as EventListener);
    }
  }, []);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {chats.length} conversation{chats.length !== 1 ? "s" : ""}
          </p>
        </header>

        {chats.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No conversations yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start swiping to find matches and begin conversations!
            </p>
            <Link
              href="/matches"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={`block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    animateIds.has(chat.id) ? "[animation:slideFadeIn_0.3s_ease-out]" : ""
                  }`}
                >
                  <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={chat.user.avatar_url}
                        alt={chat.user.full_name}
                        className="w-full h-full object-cover"
                      />
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {chat.user.full_name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slideFadeIn {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
