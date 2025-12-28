"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function BottomNavComponent() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        <Link
          href="/feed"
          className={`flex flex-col items-center justify-center flex-1 h-full btn-tactile ${
            isActive("/feed") ? "text-white" : "text-white/50"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isActive("/feed") ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isActive("/feed") ? 0 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[10px] mt-0.5">Feed</span>
        </Link>

        <Link
          href="/upload"
          className="flex items-center justify-center"
        >
          <div className={`w-12 h-10 rounded-xl flex items-center justify-center btn-tactile bg-[var(--primary)]`}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </Link>

        <Link
          href={session ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center flex-1 h-full btn-tactile ${
            isActive("/profile") ? "text-white" : "text-white/50"
          }`}
        >
          {session?.user?.image ? (
            <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${
              isActive("/profile") ? "ring-white" : "ring-transparent"
            }`}>
              <img
                src={session.user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <svg
              className="w-6 h-6"
              fill={isActive("/profile") ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isActive("/profile") ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
          <span className="text-[10px] mt-0.5">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export const BottomNav = memo(BottomNavComponent);
