import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO = Data Transfer Object. מגדיר את הצורה של הבקשה,
// וה-decorators (@IsEmail וכו') הם כללי הוולידציה ש-ValidationPipe אוכף אוטומטית.
export class RegisterDto {
  @IsEmail({}, { message: 'כתובת אימייל לא תקינה' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'הסיסמה חייבת להכיל לפחות 6 תווים' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'שם התצוגה חייב להכיל לפחות 2 תווים' })
  displayName: string;
}
