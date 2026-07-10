// שכבת התקשורת מול השירותים. כל הקריאות עוברות דרך כאן.

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001';
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:3002';
const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || 'http://localhost:3005';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  objectKey: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

// מטפל אחיד בתגובות: זורק שגיאה עם הודעה קריאה אם משהו נכשל.
async function handle(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    const raw = (body as { message?: string | string[] }).message;
    const msg = Array.isArray(raw) ? raw.join(', ') : raw;
    throw new Error(msg || 'שגיאה בשרת');
  }
  return res.json();
}

export const api = {
  register(email: string, password: string, displayName: string): Promise<AuthResponse> {
    return fetch(`${AUTH_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    }).then(handle);
  },

  login(email: string, password: string): Promise<AuthResponse> {
    return fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handle);
  },

  listVideos(): Promise<Video[]> {
    return fetch(`${MEDIA_URL}/media/videos`).then(handle);
  },

  // כתובת ההזרמה של סרטון — נותנים אותה ישירות ל-<video src>.
  streamUrl(id: string): string {
    return `${STREAM_URL}/stream/${id}`;
  },

  // העלאה עם מעקב אחוזים — משתמשים ב-XMLHttpRequest כי fetch לא נותן progress להעלאה.
  uploadVideo(
    token: string,
    file: File,
    title: string,
    description: string,
    onProgress?: (percent: number) => void,
  ): Promise<Video> {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file', file);
      form.append('title', title);
      if (description) form.append('description', description);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${MEDIA_URL}/media/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          let msg = 'שגיאת העלאה';
          try {
            msg = JSON.parse(xhr.responseText).message || msg;
          } catch {
            /* ignore */
          }
          reject(new Error(msg));
        }
      };
      xhr.onerror = () => reject(new Error('שגיאת רשת בהעלאה'));
      xhr.send(form);
    });
  },
};
