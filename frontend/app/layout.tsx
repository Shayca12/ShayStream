import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';

// Heebo — פונט מודרני שתומך בעברית ובאנגלית, עם מגוון משקלים.
const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  weight: ['300', '400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'ShayStream',
  description: 'ענן המדיה האישי שלך — סרטונים, זכרונות, מוזיקה.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
