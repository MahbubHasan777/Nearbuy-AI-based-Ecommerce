import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let token: string | undefined = request.cookies?.['auth_token'];

    if (!token) {
      const authHeader: string = request.headers?.['authorization'] ?? '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) throw new UnauthorizedException('No token provided');

    const authToken = await this.prisma.authToken.findUnique({
      where: { token },
    });

    if (!authToken || authToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = { id: authToken.userId, role: authToken.userType };
    return true;
  }
}
