import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    createModerator(email: string, password: string): Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }>;
    listModerators(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }[]>;
    deleteModerator(id: string): Promise<{
        message: string;
    }>;
}
