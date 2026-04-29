import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = Number(process.env.SMTP_PORT) || 587;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: port,
      secure: port === 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log(`[MailerService] Initializing Ethereal SMTP with Host: ${process.env.SMTP_HOST}`);
  }

  async sendOtp(email: string, otp: string) {
    const info = await this.transporter.sendMail({
      from: `"NearBuy Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your NearBuy Password Reset OTP',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
