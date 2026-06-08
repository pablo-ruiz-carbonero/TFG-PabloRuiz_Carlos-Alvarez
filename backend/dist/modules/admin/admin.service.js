"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
const role_entity_1 = require("../../database/entities/role.entity");
const crop_entity_1 = require("../../database/entities/crop.entity");
const product_entity_1 = require("../../database/entities/product.entity");
let AdminService = class AdminService {
    constructor(userRepo, roleRepo, cropRepo, productRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.cropRepo = cropRepo;
        this.productRepo = productRepo;
    }
    async getStats() {
        const [totalUsers, totalCrops, totalProducts] = await Promise.all([
            this.userRepo.count(),
            this.cropRepo.count(),
            this.productRepo.count(),
        ]);
        const usersByRole = await this.userRepo
            .createQueryBuilder('u')
            .leftJoin('u.role', 'r')
            .select('r.nombre', 'rol')
            .addSelect('COUNT(u.id)', 'total')
            .groupBy('r.nombre')
            .getRawMany();
        return { totalUsers, totalCrops, totalProducts, usersByRole };
    }
    async getUsers() {
        return this.userRepo.find({
            relations: ['role'],
            order: { fechaCreacion: 'DESC' },
        });
    }
    async updateUserRole(id, rolNombre) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const role = await this.roleRepo.findOneBy({ nombre: rolNombre });
        if (!role)
            throw new common_1.NotFoundException('Rol no encontrado');
        user.role = role;
        return this.userRepo.save(user);
    }
    async deleteUser(id) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await this.userRepo.remove(user);
    }
    async getAllCrops() {
        return this.cropRepo.find({
            relations: ['usuario'],
            order: { fechaCreacion: 'DESC' },
        });
    }
    async getAllProducts() {
        return this.productRepo.find({
            relations: ['usuario'],
            order: { fechaPublicacion: 'DESC' },
        });
    }
    async deleteProduct(id) {
        const product = await this.productRepo.findOneBy({ id });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        await this.productRepo.remove(product);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(crop_entity_1.Crop)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map