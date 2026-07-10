import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report status ok', () => {
      expect(appController.getHealth().status).toBe('ok');
    });

    it('should identify the service by name', () => {
      expect(appController.getHealth().service).toBe('media-service');
    });
  });
});
