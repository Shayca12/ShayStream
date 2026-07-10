import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// המטא-דאטה שאנחנו צריכים מ-media-service כדי להזרים.
export interface VideoMeta {
  id: string;
  title: string;
  objectKey: string;
  contentType: string;
  sizeBytes: number;
}

// לקוח HTTP קטן שפונה ל-media-service — דוגמה לתקשורת בין-שירותית (service-to-service).
@Injectable()
export class MediaClient {
  private baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'MEDIA_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  async getVideo(id: string): Promise<VideoMeta> {
    // fetch מובנה ב-Node 20+ — אין צורך בספרייה חיצונית.
    const res = await fetch(`${this.baseUrl}/media/videos/${id}`);
    if (res.status === 404) {
      throw new NotFoundException('סרטון לא נמצא');
    }
    if (!res.ok) {
      throw new InternalServerErrorException('שגיאה בפניה ל-media-service');
    }
    return (await res.json()) as VideoMeta;
  }
}
