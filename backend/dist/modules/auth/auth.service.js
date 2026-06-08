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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../database/entities/user.entity");
const role_entity_1 = require("../../database/entities/role.entity");
let AuthService = class AuthService {
    constructor(userRepository, roleRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existe = await this.userRepository.findOneBy({ email: dto.email });
        if (existe)
            throw new common_1.ConflictException("El email ya está registrado");
        const hashed = await bcrypt.hash(dto.password, 10);
        let roleId = 1;
        if (dto.rol) {
            const role = await this.roleRepository.findOneBy({ nombre: dto.rol });
            if (role)
                roleId = role.id;
        }
        const user = this.userRepository.create({
            nombre: dto.nombre,
            email: dto.email,
            telefono: dto.telefono,
            password: hashed,
            role: { id: roleId },
        });
        await this.userRepository.save(user);
        const userConRol = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['role'],
        });
        const accessToken = this.generarToken(userConRol);
        return {
            accessToken,
            user: this.serializarUser(userConRol),
        };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            relations: ["role"],
        });
        if (!user)
            throw new common_1.UnauthorizedException("Credenciales incorrectas");
        const valido = await bcrypt.compare(dto.password, user.password);
        if (!valido)
            throw new common_1.UnauthorizedException("Credenciales incorrectas");
        const accessToken = this.generarToken(user);
        return {
            accessToken,
            user: this.serializarUser(user),
        };
    }
    async getMe(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["role"],
        });
        if (!user)
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        return this.serializarUser(user);
    }
    async updateProfile(userId, dto) {
        await this.userRepository.update(userId, {
            nombre: dto.nombre ?? dto.name,
            telefono: dto.telefono ?? dto.phone,
        });
        return this.getMe(userId);
    }
    async changePassword(userId, dto) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        const valido = await bcrypt.compare(dto.current_password, user.password);
        if (!valido)
            throw new common_1.UnauthorizedException('Contraseña actual incorrecta');
        user.password = await bcrypt.hash(dto.new_password, 10);
        await this.userRepository.save(user);
    }
    generarToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            rol: user.role?.nombre ?? null,
        };
        return this.jwtService.sign(payload);
    }
    serializarUser(user) {
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono ?? null,
            rol: user.role?.nombre ?? null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map