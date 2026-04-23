import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TokenGuard } from '../auth/guards/token.guard';

@Controller('notifications')
@UseGuards(TokenGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Req() req: any) {
    return this.notificationService.getMyNotifications(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
