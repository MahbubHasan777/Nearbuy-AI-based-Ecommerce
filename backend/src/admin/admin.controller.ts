import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { TokenGuard } from '../auth/guards/token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(TokenGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('moderators')
  createModerator(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.createModerator(email, password);
  }

  @Get('moderators')
  listModerators() {
    return this.adminService.listModerators();
  }

  @Delete('moderators/:id')
  deleteModerator(@Param('id') id: string) {
    return this.adminService.deleteModerator(id);
  }
}
