import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';
import { TokenGuard } from './guards/token.guard';

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService, TokenGuard],
  exports: [TokenGuard, AuthService],
})
export class AuthModule {}
