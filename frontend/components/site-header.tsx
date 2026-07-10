'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-base/70 border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-l from-accent to-accent-2 bg-clip-text text-transparent">
            ShayStream
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg bg-gradient-to-l from-accent to-accent-2 text-white text-sm font-semibold"
          >
            + העלאה
          </Link>
          {user && (
            <>
              <div className="w-9 h-9 rounded-full bg-surface-2 grid place-items-center text-sm font-bold">
                {user.displayName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="text-muted hover:text-ink text-sm"
              >
                יציאה
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
