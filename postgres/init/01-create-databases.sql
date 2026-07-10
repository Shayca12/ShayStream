-- רץ אוטומטית ע"י Postgres רק באתחול ראשון של ה-volume (data dir ריק).
-- מסד shaystream (של auth) נוצר ע"י POSTGRES_DB. כאן ניצור את השאר.
-- מבטיח שמי שמשכפל את הפרויקט ומריץ `docker compose up` יקבל את כל מסדי הנתונים.

SELECT 'CREATE DATABASE shaystream_media'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shaystream_media')\gexec
