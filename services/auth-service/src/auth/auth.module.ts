import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // מגדירים את JwtModule עם ערכים מתוך .env (async כי צריך את ConfigService)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // מגיע כמחרוזת מ-.env (למשל "1d"). הטיפוס של @nestjs/jwt מחמיר, לכן cast.
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
