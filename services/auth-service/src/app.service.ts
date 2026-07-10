import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // מחזיר אובייקט סטטוס פשוט. בהמשך אפשר להרחיב לבדיקת DB, MinIO וכו'.
  getHealth() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }
}
