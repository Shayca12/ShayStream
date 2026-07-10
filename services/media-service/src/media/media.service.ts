import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../storage/minio.service';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async upload(ownerId: string, file: Express.Multer.File, dto: UploadDto) {
    if (!file) {
      throw new BadRequestException('לא צורף קובץ');
    }

    // בונים מפתח ייחודי לאובייקט: <userId>/<uuid>.<סיומת>
    const ext = file.originalname.split('.').pop() || 'bin';
    const objectKey = `${ownerId}/${randomUUID()}.${ext}`;

    // 1) מעלים את הקובץ עצמו ל-MinIO
    await this.minio.putObject(
      objectKey,
      file.buffer,
      file.size,
      file.mimetype,
    );

    // 2) שומרים את המטא-דאטה ב-Postgres
    return this.prisma.video.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        ownerId,
        objectKey,
        contentType: file.mimetype,
        sizeBytes: file.size,
      },
    });
  }

  // מחזיר את כל הסרטונים (החדשים קודם). בהמשך נסנן לפי הרשאות/שיתופים.
  listAll() {
    return this.prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // מחזיר סרטון בודד לפי id (או 404). stream-service משתמש בזה כדי לקבל את ה-objectKey.
  async getOne(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) {
      throw new NotFoundException('סרטון לא נמצא');
    }
    return video;
  }
}
