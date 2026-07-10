'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { SiteHeader } from '@/components/site-header';

export default function UploadPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return null;

  function pickFile(f: File | null) {
    if (!f) return;
    setFile(f);
    // אם אין כותרת עדיין — נשתמש בשם הקובץ (בלי הסיומת) כברירת מחדל.
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !token) return;
    setError('');
    setBusy(true);
    setProgress(0);
    try {
      const video = await api.uploadVideo(
        token,
        file,
        title,
        description,
        setProgress,
      );
      router.push(`/watch/${video.id}`); // ישר לצפייה בסרטון החדש
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאת העלאה');
      setBusy(false);
    }
  }

  const mb = file ? (file.size / (1024 * 1024)).toFixed(1) : null;

  return (
    <div className="min-h-screen cinematic-bg">
      <SiteHeader />
      <main className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-black mb-8">העלאת סרטון 🎬</h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* אזור בחירת קובץ */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pickFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className="cursor-pointer border-2 border-dashed border-line hover:border-accent/60 rounded-2xl p-10 text-center transition-colors bg-surface/40"
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div>
                <p className="text-4xl mb-2">🎞️</p>
                <p className="font-semibold">{file.name}</p>
                <p className="text-muted text-sm">{mb} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">⬆️</p>
                <p className="font-semibold">גרור לכאן קובץ וידאו</p>
                <p className="text-muted text-sm">או לחץ לבחירה</p>
              </div>
            )}
          </div>

          <Field label="כותרת" value={title} onChange={setTitle} />
          <Field
            label="תיאור (אופציונלי)"
            value={description}
            onChange={setDescription}
          />

          {/* פס התקדמות */}
          {busy && (
            <div>
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-accent to-accent-2"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.2 }}
                />
              </div>
              <p className="text-sm text-muted mt-1.5 text-center">
                מעלה... {progress}%
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: busy ? 1 : 0.98 }}
            disabled={!file || busy}
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-l from-accent to-accent-2 disabled:opacity-50"
          >
            {busy ? 'מעלה...' : 'העלה'}
          </motion.button>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted mb-1.5 block">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-base border border-line rounded-xl px-4 py-3 text-ink focus:border-accent focus:outline-none transition-colors"
      />
    </label>
  );
}
