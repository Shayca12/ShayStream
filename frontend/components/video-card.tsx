'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video } from '@/lib/api';

// יוצר צבע gradient יציב מתוך ה-id — פסאודו-פוסטר עד שיהיו תמונות ממוזערות אמיתיות.
function gradientFor(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `linear-gradient(135deg, hsl(${h} 55% 24%), hsl(${(h + 45) % 360} 50% 14%))`;
}

export function VideoCard({ video, index }: { video: Video; index: number }) {
  const mb = (video.sizeBytes / (1024 * 1024)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/watch/${video.id}`} className="group block">
        <div
          className="aspect-video rounded-xl overflow-hidden border border-line relative transition-transform duration-300 group-hover:scale-[1.03] group-hover:border-accent/50"
          style={{ background: gradientFor(video.id) }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur grid place-items-center text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
              ▶
            </div>
          </div>
        </div>
        <h3 className="mt-2 font-semibold truncate group-hover:text-accent transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-muted">{mb} MB</p>
      </Link>
    </motion.div>
  );
}
