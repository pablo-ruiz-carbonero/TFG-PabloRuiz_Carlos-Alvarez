"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const production_entity_1 = require("../../database/entities/production.entity");
const productions_controller_1 = require("./productions.controller");
const productions_service_1 = require("./productions.service");
let ProductionsModule = class ProductionsModule {
};
exports.ProductionsModule = ProductionsModule;
exports.ProductionsModule = ProductionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([production_entity_1.Production])],
        controllers: [productions_controller_1.ProductionsController],
        providers: [productions_service_1.ProductionsService],
    })
], ProductionsModule);
//# sourceMappingURL=productions.module.js.map