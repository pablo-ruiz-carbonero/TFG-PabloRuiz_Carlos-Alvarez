import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { Crop } from '../../database/entities/crop.entity';
import { Product } from '../../database/entities/product.entity';
export declare class AdminService {
    private readonly userRepo;
    private readonly roleRepo;
    private readonly cropRepo;
    private readonly productRepo;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>, cropRepo: Repository<Crop>, productRepo: Repository<Product>);
    getStats(): Promise<{
        totalUsers: number;
        totalCrops: number;
        totalProducts: number;
        usersByRole: any[];
    }>;
    getUsers(): Promise<User[]>;
    updateUserRole(id: number, rolNombre: string): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getAllCrops(): Promise<Crop[]>;
    getAllProducts(): Promise<Product[]>;
    deleteProduct(id: number): Promise<void>;
}
