import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { MinioService } from '../storage/minio.service';
import { MediaClient } from '../media/media.client';

@Module({
  controllers: [StreamController],
  providers: [MinioService, MediaClient],
})
export class StreamModule {}
