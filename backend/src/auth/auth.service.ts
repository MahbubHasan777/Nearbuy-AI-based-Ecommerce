import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}

  private generateToken(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  private async cleanExpiredTokens(userId: string, userType: UserType) {
    const tokens = await this.prisma.authToken.findMany({
      where: { userId, userType },
      orderBy: { createdAt: 'asc' },
    });

    if (tokens.length > 10) {
      const expired = tokens.filter((t: any) => t.expiresAt < new Date());
      if (expired.length > 0) {
        await this.prisma.authToken.deleteMany({
          where: { id: { in: expired.map((t: any) => t.id) } },
        });
      }
    }
  }

  async login(dto: LoginDto): Promise<string> {
    const { email, password, userType } = dto;
    let user: any = null;

    if (userType === 'ADMIN') {
      user = await this.prisma.admin.findUnique({ where: { email } });
    } else if (userType === 'MODERATOR') {
      user = await this.prisma.moderator.findUnique({ where: { email } });
    } else if (userType === 'SHOP') {
      user = await this.prisma.shop.findUnique({ where: { ownerEmail: email } });
      if (user && user.status !== 'APPROVED') {
        throw new UnauthorizedException('Shop not approved yet');
      }
    } else if (userType === 'CUSTOMER') {
      user = await this.prisma.customer.findUnique({ where: { email } });
      if (user && !user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }
    } else {
      throw new BadRequestException('Invalid userType');
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.authToken.create({
      data: {
        token,
        userId: user.id,
        userType: userType as UserType,
        expiresAt,
      },
    });

    await this.cleanExpiredTokens(user.id, userType as UserType);

    return token;
  }

  async logout(token: string) {
    await this.prisma.authToken.delete({ where: { token } });
  }

  async logoutAll(userId: string, userType: UserType) {
    await this.prisma.authToken.deleteMany({ where: { userId, userType } });
  }

  async getSessions(userId: string, userType: UserType) {
    return this.prisma.authToken.findMany({
      where: { userId, userType, expiresAt: { gt: new Date() } },
      select: { id: true, createdAt: true, expiresAt: true },
    });
  }

  async getMe(userId: string, userType: UserType) {
    if (userType === 'CUSTOMER') {
      const u = await this.prisma.customer.findUnique({ where: { id: userId } });
      if (!u) return null;
      return { id: u.id, email: u.email, name: u.fullName, role: 'CUSTOMER' };
    } else if (userType === 'SHOP') {
      const u = await this.prisma.shop.findUnique({ where: { id: userId } });
      if (!u) return null;
      return { id: u.id, email: u.ownerEmail, name: u.shopName, role: 'SHOP' };
    } else if (userType === 'ADMIN') {
      const u = await this.prisma.admin.findUnique({ where: { id: userId } });
      if (!u) return null;
      return { id: u.id, email: u.email, name: u.name, role: 'ADMIN' };
    } else if (userType === 'MODERATOR') {
      const u = await this.prisma.moderator.findUnique({ where: { id: userId } });
      if (!u) return null;
      return { id: u.id, email: u.email, name: u.name, role: 'MODERATOR' };
    }
    return null;
  }

  async forgotPassword(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.oTP.create({ data: { email, otp, expiresAt } });
    await this.mailer.sendOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await this.prisma.oTP.findFirst({
      where: { email, otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid or expired OTP');
    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const record = await this.prisma.oTP.findFirst({
      where: { email, otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid or expired OTP');

    const hash = await bcrypt.hash(newPassword, 12);

    const customer = await this.prisma.customer.findUnique({ where: { email } });
    if (customer) {
      await this.prisma.customer.update({ where: { email }, data: { passwordHash: hash } });
    } else {
      const shop = await this.prisma.shop.findUnique({ where: { ownerEmail: email } });
      if (shop) {
        await this.prisma.shop.update({ where: { ownerEmail: email }, data: { passwordHash: hash } });
      }
    }

    await this.prisma.oTP.update({ where: { id: record.id }, data: { used: true } });
  }
}
