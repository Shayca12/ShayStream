import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

// קוראים את הגרסה מ-package.json פעם אחת בטעינה, וחושפים אותה ב-/health.
const { version } = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
) as { version: string };

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'media-service',
      version,
      timestamp: new Date().toISOString(),
    };
  }
}
