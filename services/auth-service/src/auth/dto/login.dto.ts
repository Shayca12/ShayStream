import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'כתובת אימייל לא תקינה' })
  email: string;

  @IsString()
  password: string;
}
