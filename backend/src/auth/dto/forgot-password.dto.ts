import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  otp: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  otp: string;

  newPassword: string;
}
