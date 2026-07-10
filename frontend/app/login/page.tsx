'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'משהו השתבש');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="cinematic-bg min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* לוגו */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-l from-accent to-accent-2 bg-clip-text text-transparent">
              ShayStream
            </span>
          </h1>
          <p className="text-muted mt-2">ענן המדיה האישי שלך 🎬</p>
        </div>

        {/* כרטיס */}
        <div className="bg-surface/80 backdrop-blur border border-line rounded-2xl p-8 glow-accent">
          {/* מתגי מצב */}
          <div className="flex bg-base rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'login' ? 'התחברות' : 'הרשמה'}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Field
                    label="שם תצוגה"
                    value={displayName}
                    onChange={setDisplayName}
                    placeholder="איך יקראו לך"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              label="אימייל"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="סיסמה"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="לפחות 6 תווים"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={busy}
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-l from-accent to-accent-2 disabled:opacity-60"
            >
              {busy
                ? 'רגע...'
                : mode === 'login'
                  ? 'כניסה'
                  : 'יצירת חשבון'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

// שדה קלט מעוצב
function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-base border border-line rounded-xl px-4 py-3 text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
      />
    </label>
  );
}
