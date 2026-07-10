import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Guard = "שומר סף". רץ לפני ה-controller ומחליט אם לתת לבקשה לעבור.
// כאן: מאמת את ה-JWT שהונפק ע"י auth-service, בלי לשאול אותו — רק עם ה-secret המשותף.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('חסר טוקן הזדהות (Bearer)');
    }

    const token = authHeader.substring('Bearer '.length);
    try {
      // מאמתים את החתימה עם אותו JWT_SECRET של auth-service.
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      // מצמידים את פרטי המשתמש לבקשה — ה-controller יוכל לגשת אליהם.
      (req as Request & { user?: unknown }).user = {
        id: payload.sub,
        email: payload.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('טוקן לא תקין או פג תוקף');
    }
  }
}
