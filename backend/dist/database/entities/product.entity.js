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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User'),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Product.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "unidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "imagenes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_publicacion' }),
    __metadata("design:type", Date)
], Product.prototype, "fechaPublicacion", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('productos')
], Product);
//# sourceMappingURL=product.entity.js.map