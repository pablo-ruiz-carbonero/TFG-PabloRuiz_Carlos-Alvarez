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
exports.ProductionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const production_entity_1 = require("../../database/entities/production.entity");
let ProductionsService = class ProductionsService {
    constructor(productionRepository) {
        this.productionRepository = productionRepository;
    }
    async findByCrop(cropId, userId) {
        return this.productionRepository.find({
            where: { cultivo: { id: cropId, usuario: { id: userId } } },
            relations: ['cultivo'],
            order: { fecha: 'DESC' },
        });
    }
    async findAll(userId) {
        return this.productionRepository.find({
            where: { cultivo: { usuario: { id: userId } } },
            relations: ['cultivo'],
            order: { fecha: 'DESC' },
        });
    }
    async create(dto, userId) {
        const production = this.productionRepository.create({
            cantidad: dto.cantidad,
            fecha: dto.fecha,
            cultivo: { id: dto.cultivo_id },
        });
        return this.productionRepository.save(production);
    }
    async update(id, dto, userId) {
        const production = await this.productionRepository.findOne({
            where: { id },
            relations: ['cultivo', 'cultivo.usuario'],
        });
        if (!production)
            throw new common_1.NotFoundException('Producción no encontrada');
        if (production.cultivo.usuario.id !== userId)
            throw new common_1.ForbiddenException();
        Object.assign(production, dto);
        return this.productionRepository.save(production);
    }
    async remove(id, userId) {
        const production = await this.productionRepository.findOne({
            where: { id },
            relations: ['cultivo', 'cultivo.usuario'],
        });
        if (!production)
            throw new common_1.NotFoundException('Producción no encontrada');
        if (production.cultivo.usuario.id !== userId)
            throw new common_1.ForbiddenException();
        await this.productionRepository.remove(production);
    }
};
exports.ProductionsService = ProductionsService;
exports.ProductionsService = ProductionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(production_entity_1.Production)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductionsService);
//# sourceMappingURL=productions.service.js.map