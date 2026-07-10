import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, // גישה ל-DB (הוזרק)
    private readonly jwt: JwtService, // יצירת טוקנים (הוזרק)
  ) {}

  async register(dto: RegisterDto) {
    // 1. לוודא שאין כבר משתמש עם אותו אימייל
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('כתובת האימייל כבר רשומה');
    }

    // 2. להצפין את הסיסמה. 10 = "salt rounds" (חוזק ההצפנה).
    //    לעולם לא שומרים את הסיסמה עצמה — רק את ה-hash החד-כיווני שלה.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3. ליצור את המשתמש ב-DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    });

    return this.buildAuthResponse(user.id, user.email, user.displayName);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // הערת אבטחה: מחזירים אותה הודעה גם כשאין משתמש וגם כשהסיסמה שגויה,
    // כדי לא לחשוף לתוקף אילו אימיילים רשומים במערכת.
    if (!user) {
      throw new UnauthorizedException('אימייל או סיסמה שגויים');
    }

    // משווים את הסיסמה שהתקבלה ל-hash השמור (bcrypt יודע לעשות זאת בבטחה)
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('אימייל או סיסמה שגויים');
    }

    return this.buildAuthResponse(user.id, user.email, user.displayName);
  }

  // בונה את תשובת ההזדהות: פרטי המשתמש + טוקן JWT חתום.
  // ה-payload של הטוקן: sub (מזהה המשתמש) + email. הוא ייחתם עם JWT_SECRET.
  private async buildAuthResponse(
    userId: string,
    email: string,
    displayName: string,
  ) {
    const accessToken = await this.jwt.signAsync({ sub: userId, email });
    return {
      user: { id: userId, email, displayName },
      accessToken,
    };
  }
}
