import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaService עוטף את PrismaClient והופך אותו ל-"provider" של Nest,
// כך שנוכל להזריק אותו (DI) לכל service שצריך גישה ל-DB.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // רץ פעם אחת כשהמודול עולה — פותח את החיבור ל-DB.
  async onModuleInit() {
    await this.$connect();
  }
}
