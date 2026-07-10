import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'stream-service',
      timestamp: new Date().toISOString(),
    };
  }
}
