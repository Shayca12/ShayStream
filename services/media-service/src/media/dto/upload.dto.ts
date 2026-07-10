import { IsOptional, IsString, MinLength } from 'class-validator';

// שדות הטקסט שמגיעים יחד עם הקובץ (multipart/form-data).
export class UploadDto {
  @IsString()
  @MinLength(1, { message: 'חובה כותרת לסרטון' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
