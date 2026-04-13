import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createModerator(email: string, password: string) {
    const existing = await this.prisma.moderator.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Moderator already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const mod = await this.prisma.moderator.create({ data: { email, passwordHash } });
    const { passwordHash: _, ...result } = mod;
    return result;
  }

  async listModerators() {
    return this.prisma.moderator.findMany({
      select: { id: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteModerator(id: string) {
    const mod = await this.prisma.moderator.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException('Moderator not found');

    await this.prisma.moderator.delete({ where: { id } });
    return { message: 'Moderator deleted' };
  }
}
