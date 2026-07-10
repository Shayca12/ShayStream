import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';

// stream-service רק *קורא* מ-MinIO (לא כותב). מספק: מידע על אובייקט + זרם בייטים (מלא/חלקי).
@Injectable()
export class MinioService {
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

  // מידע על האובייקט (בעיקר הגודל בבייטים).
  statObject(objectKey: string) {
    return this.client.statObject(this.bucket, objectKey);
  }

  // זרם של כל הקובץ.
  getObject(objectKey: string): Promise<Readable> {
    return this.client.getObject(this.bucket, objectKey);
  }

  // זרם של חלק מהקובץ (מ-offset, באורך length) — הבסיס ל-Range requests.
  getPartialObject(
    objectKey: string,
    offset: number,
    length: number,
  ): Promise<Readable> {
    return this.client.getPartialObject(this.bucket, objectKey, offset, length);
  }
}
