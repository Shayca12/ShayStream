import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

// עוטף את הלקוח של MinIO. אחראי על יצירת ה-bucket והעלאת קבצים.
@Injectable()
export class MinioService implements OnModuleInit {
  private client: Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.config.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: this.config.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', ''),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', ''),
    });
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'shaystream-media');
  }

  // בהתנעת השירות — יוצרים את ה-bucket אם עוד לא קיים.
  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      console.log(`🪣 נוצר bucket חדש: ${this.bucket}`);
    }
  }

  // מעלה קובץ (buffer) ל-MinIO תחת מפתח נתון.
  async putObject(
    objectKey: string,
    buffer: Buffer,
    size: number,
    contentType: string,
  ) {
    await this.client.putObject(this.bucket, objectKey, buffer, size, {
      'Content-Type': contentType,
    });
  }
}
