import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// @Controller('auth') → כל ה-routes כאן מתחילים ב-/auth
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register — @Body ממפה את גוף הבקשה ל-DTO (ומוודא ולידציה)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
