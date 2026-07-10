import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── ולידציה גלובלית ──
  // כל בקשה נכנסת תיבדק אוטומטית מול ה-DTOs שנגדיר (ניצור אותם בהמשך).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // מסיר שדות שלא הוגדרו ב-DTO (הגנה מקלט זדוני)
      forbidNonWhitelisted: true, // מחזיר שגיאה אם נשלח שדה לא מוכר
      transform: true, // ממיר טיפוסים אוטומטית (למשל "5" → 5)
    }),
  );

  // ── CORS ──
  // מאפשר ל-frontend (שרץ ב-origin/פורט אחר) לקרוא ל-API הזה.
  app.enableCors();

  // הפורט נלקח ממשתנה סביבה — כך אותו קוד רץ מקומית ובקונטיינר בלי שינוי.
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🔐 auth-service listening on port ${port}`);
}
bootstrap();
