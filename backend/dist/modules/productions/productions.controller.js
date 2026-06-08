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
exports.ProductionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const productions_service_1 = require("./productions.service");
const production_dto_1 = require("./dto/production.dto");
let ProductionsController = class ProductionsController {
    constructor(productionsService) {
        this.productionsService = productionsService;
    }
    findAll(req) {
        return this.productionsService.findAll(req.user.id);
    }
    findByCrop(cropId, req) {
        return this.productionsService.findByCrop(+cropId, req.user.id);
    }
    create(dto, req) {
        return this.productionsService.create(dto, req.user.id);
    }
    update(id, dto, req) {
        return this.productionsService.update(+id, dto, req.user.id);
    }
    remove(id, req) {
        return this.productionsService.remove(+id, req.user.id);
    }
};
exports.ProductionsController = ProductionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('crop/:cropId'),
    __param(0, (0, common_1.Param)('cropId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductionsController.prototype, "findByCrop", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_dto_1.CreateProductionDto, Object]),
    __metadata("design:returntype", void 0)
], ProductionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_dto_1.UpdateProductionDto, Object]),
    __metadata("design:returntype", void 0)
], ProductionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductionsController.prototype, "remove", null);
exports.ProductionsController = ProductionsController = __decorate([
    (0, common_1.Controller)('productions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [productions_service_1.ProductionsService])
], ProductionsController);
//# sourceMappingURL=productions.controller.js.map