'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { api, Video } from '@/lib/api';
import { SiteHeader } from '@/components/site-header';

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playError, setPlayError] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (user && id) {
      api
        .getVideo(id)
        .then(setVideo)
        .catch(() => setNotFound(true));
    }
  }, [user, id]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen cinematic-bg">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="text-muted hover:text-ink mb-4 text-sm"
        >
          ← חזרה לספרייה
        </button>

        {notFound ? (
          <p className="text-muted">הסרטון לא נמצא.</p>
        ) : !video ? (
          <p className="text-muted">טוען...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* הנגן — ה-src מצביע ישירות ל-stream-service.
                הדפדפן שולח אוטומטית בקשות Range כשגוררים את סרגל הזמן. */}
            <div className="rounded-2xl overflow-hidden border border-line bg-black glow-accent">
              <video
                src={api.streamUrl(video.id)}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                onError={() => setPlayError(true)}
              />
            </div>

            {playError && (
              <p className="mt-3 text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">
                לא ניתן לנגן את הקובץ הזה (כנראה אינו וידאו תקין). נסה להעלות קובץ
                mp4 אמיתי.
              </p>
            )}

            <h1 className="text-2xl font-black mt-5">{video.title}</h1>
            {video.description && (
              <p className="text-muted mt-1">{video.description}</p>
            )}
            <p className="text-xs text-muted mt-2">
              {(video.sizeBytes / (1024 * 1024)).toFixed(1)} MB ·{' '}
              {video.contentType}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
