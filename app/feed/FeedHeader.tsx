"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function FeedHeader() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      {/* Header - overlays the video */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
        <Link href="/" className="flex items-center pointer-events-auto">
          <span className="text-lg font-bold tracking-tight drop-shadow-lg">
            <span className="text-white">Clip</span>
            <span className="text-amber-200">Verse</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 pointer-events-auto">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center text-sm font-medium transition-colors duration-150 ${
                  isAdmin 
                    ? "bg-[var(--admin)]/30 text-[var(--admin)] ring-2 ring-[var(--admin)]/50 hover:bg-[var(--admin)]/40" 
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  session.user?.email?.[0].toUpperCase() || "U"
                )}
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-12 w-56 bg-[var(--background-elevated)] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate flex-1">{session.user?.email}</p>
                        {isAdmin && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[var(--admin)]/20 text-[var(--admin)] rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/upload"
                        className="block px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        Upload video
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-[var(--admin)] hover:bg-[var(--admin)]/10 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                            Admin Panel
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm bg-[var(--primary)]/80 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-[var(--primary)] transition-colors duration-150"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
