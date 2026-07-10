import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { MinioService } from '../storage/minio.service';
import { MediaClient } from '../media/media.client';

@Controller('stream')
export class StreamController {
  constructor(
    private readonly minio: MinioService,
    private readonly media: MediaClient,
  ) {}

  // GET /stream/:id — מזרים את הווידאו, עם תמיכה מלאה ב-Range requests.
  @Get(':id')
  async stream(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // 1) שואלים את media-service מה ה-objectKey וה-content-type
    const video = await this.media.getVideo(id);

    // 2) הגודל האמיתי של הקובץ מ-MinIO
    const stat = await this.minio.statObject(video.objectKey);
    const total = stat.size;

    const range = req.headers.range;

    // ── אין Range: מחזירים את כל הקובץ (200 OK) ──
    // Accept-Ranges מודיע לדפדפן "אני תומך ב-Range" — כך הוא ידע לבקש seek.
    if (!range) {
      res.status(200);
      res.setHeader('Content-Type', video.contentType);
      res.setHeader('Content-Length', String(total));
      res.setHeader('Accept-Ranges', 'bytes');
      const full = await this.minio.getObject(video.objectKey);
      full.pipe(res);
      return;
    }

    // ── יש Range: מפענחים "bytes=start-end" ──
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    let start = match && match[1] ? parseInt(match[1], 10) : 0;
    let end = match && match[2] ? parseInt(match[2], 10) : total - 1;

    // בקשה מחוץ לתחום → 416 Range Not Satisfiable
    if (start > end || start >= total) {
      res.status(416);
      res.setHeader('Content-Range', `bytes */${total}`);
      res.end();
      return;
    }
    if (end >= total) end = total - 1;

    const chunkSize = end - start + 1;

    // ── מחזירים 206 Partial Content — זה מה שמאפשר seek מיידי! ──
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', String(chunkSize));
    res.setHeader('Content-Type', video.contentType);

    const partial = await this.minio.getPartialObject(
      video.objectKey,
      start,
      chunkSize,
    );
    partial.pipe(res);
  }
}
