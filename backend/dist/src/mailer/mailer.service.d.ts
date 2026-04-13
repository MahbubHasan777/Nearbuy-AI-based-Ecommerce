export declare class MailerService {
    private transporter;
    constructor();
    sendOtp(email: string, otp: string): Promise<void>;
}
