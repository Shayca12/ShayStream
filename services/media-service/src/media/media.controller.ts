import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { UploadDto } from './dto/upload.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // POST /media/upload — דורש טוקן (JwtAuthGuard) ומקבל קובץ בשדה "file".
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDto,
  ) {
    // ה-ownerId מגיע מהטוקן — לא מהלקוח. הלקוח לא יכול להתחזות.
    return this.mediaService.upload(user.id, file, dto);
  }

  // GET /media/videos — רשימת הסרטונים (פתוח לצפייה ב-MVP).
  @Get('videos')
  list() {
    return this.mediaService.listAll();
  }
}
