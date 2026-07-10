'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { api, Video } from '@/lib/api';
import { SiteHeader } from '@/components/site-header';
import { VideoCard } from '@/components/video-card';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [fetching, setFetching] = useState(true);

  // שומר סף: לא מחובר → מסך התחברות.
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  // טוען את רשימת הסרטונים כשיש משתמש.
  useEffect(() => {
    if (user) {
      api
        .listVideos()
        .then(setVideos)
        .catch(() => setVideos([]))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen cinematic-bg">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-black mb-1">
          שלום, {user.displayName} 👋
        </h2>
        <p className="text-muted mb-8">הספרייה שלך</p>

        {fetching ? (
          <p className="text-muted">טוען...</p>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 border border-line border-dashed rounded-2xl">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-lg mb-1">עוד אין סרטונים בספרייה</p>
            <p className="text-muted mb-6">בוא נעלה את הראשון!</p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-accent to-accent-2 text-white font-bold"
            >
              העלאת סרטון
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
