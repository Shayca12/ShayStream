import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // בדיקת חיים (health check).
  // Docker (healthcheck) ו-Kubernetes (livenessProbe) יקראו ל-GET /health
  // כדי לדעת שהשירות חי ומגיב. אם זה נכשל — הם יפעילו אותו מחדש.
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
