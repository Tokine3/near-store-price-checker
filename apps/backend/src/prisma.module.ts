import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // PrismaService を他のモジュールにエクスポート
})
export class PrismaModule {}
