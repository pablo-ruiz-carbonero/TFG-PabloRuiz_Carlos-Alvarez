import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        totalCrops: number;
        totalProducts: number;
        usersByRole: any[];
    }>;
    getUsers(): Promise<import("../../database/entities/user.entity").User[]>;
    updateRole(id: number, rol: string): Promise<import("../../database/entities/user.entity").User>;
    deleteUser(id: number): Promise<void>;
    getAllCrops(): Promise<import("../../database/entities/crop.entity").Crop[]>;
    getAllProducts(): Promise<import("../../database/entities/product.entity").Product[]>;
    deleteProduct(id: number): Promise<void>;
}
