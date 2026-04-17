import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from './dto/forgot-password.dto';
import { TokenGuard } from './guards/token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto);

    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful', token };
  }

  @Post('logout')
  @UseGuards(TokenGuard)
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.['auth_token'];
    await this.authService.logout(token);
    res.clearCookie('auth_token');
    return { message: 'Logged out' };
  }

  @Post('logout-all')
  @UseGuards(TokenGuard)
  @HttpCode(200)
  async logoutAll(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(req.user.id, req.user.role);
    res.clearCookie('auth_token');
    return { message: 'All sessions cleared' };
  }

  @Get('sessions')
  @UseGuards(TokenGuard)
  async getSessions(@Req() req: any) {
    return this.authService.getSessions(req.user.id, req.user.role);
  }

  @Get('me')
  @UseGuards(TokenGuard)
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id, req.user.role);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'OTP sent to email' };
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto.email, dto.otp);
    return { message: 'OTP verified' };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
    return { message: 'Password reset successful' };
  }
}
