import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global — הופך את PrismaService לזמין בכל מודול בלי לייבא ידנית בכל פעם.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // חושף אותו למודולים אחרים (auth ישתמש בו)
})
export class PrismaModule {}
