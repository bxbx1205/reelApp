import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/feed");
  }

  return (
    <main className="h-[100dvh] w-full bg-[var(--background)] overflow-hidden flex flex-col">
      <nav className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Clip</span>
            <span className="text-amber-200">Verse</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-[var(--foreground-muted)] hover:text-white transition-colors duration-150"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors duration-150"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[var(--foreground-subtle)] uppercase tracking-wider">
                  Short-form video
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
                  Your Universe
                  <br />
                  <span className="text-[var(--foreground-muted)]">of Clips.</span>
                </h1>
              </div>
              <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed max-w-md mx-auto lg:mx-0">
                A clean, distraction-free space for short videos. Watch, create, and share moments that matter.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-all duration-150 btn-tactile"
                >
                  Get started
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[var(--foreground-muted)] hover:text-white transition-colors duration-150"
                >
                  Browse videos
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-video bg-[var(--background-elevated)] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-sm">
                      <svg className="w-10 h-10 text-white/70 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-white/50">Your universe awaits</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-16 space-y-2">
                  <div className="h-3 w-28 bg-white/20 rounded" />
                  <div className="h-2 w-44 bg-white/10 rounded" />
                </div>
                <div className="absolute bottom-4 right-4 space-y-3">
                  <div className="w-9 h-9 rounded-full bg-white/10" />
                  <div className="w-9 h-9 rounded-full bg-white/10" />
                </div>
              </div>
              
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--primary)]/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <footer className="flex-shrink-0 py-4 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[var(--foreground-subtle)]">
          <span className="font-semibold">
            <span className="text-white">Clip</span>
            <span className="text-amber-200">Verse</span>
          </span>
          <p>Built with ❤️ by Bxbx</p>
        </div>
      </footer>
    </main>
  );
}
