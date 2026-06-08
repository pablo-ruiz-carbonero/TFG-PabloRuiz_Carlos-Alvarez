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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const crops_service_1 = require("./crops.service");
const tasks_service_1 = require("../tasks/tasks.service");
const create_crop_dto_1 = require("./dto/create-crop.dto");
const activity_dto_1 = require("./dto/activity.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let CropsController = class CropsController {
    constructor(cropsService, tasksService) {
        this.cropsService = cropsService;
        this.tasksService = tasksService;
    }
    create(createCropDto, req) {
        return this.cropsService.create(createCropDto, req.user.id);
    }
    findAll(req) {
        return this.cropsService.findAll(req.user.id);
    }
    findByFarmer(req) {
        return this.cropsService.findAll(req.user.id);
    }
    getParcels(req) {
        return this.cropsService.getParcels(req.user.id);
    }
    createParcel(body, req) {
        return this.cropsService.createParcel(req.user.id, body);
    }
    findOne(id, req) {
        return this.cropsService.findOne(+id, req.user.id);
    }
    update(id, updateCropDto, req) {
        return this.cropsService.update(+id, updateCropDto, req.user.id);
    }
    remove(id, req) {
        return this.cropsService.remove(+id, req.user.id);
    }
    async createActivity(cropId, dto, req) {
        const taskDto = {
            cultivo_id: +cropId,
            tipo: activity_dto_1.ACTIVITY_TO_TAREA[dto.type] ?? 'siembra',
            fecha: dto.date,
            descripcion: dto.details,
            cantidad: dto.quantity,
            unidad: dto.unit,
        };
        const task = await this.tasksService.create(taskDto, req.user.id);
        return (0, activity_dto_1.taskToActivity)(task, cropId);
    }
    deleteActivity(activityId, req) {
        return this.tasksService.remove(+activityId, req.user.id);
    }
};
exports.CropsController = CropsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_crop_dto_1.CreateCropDto, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('farmer/:farmerId'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "findByFarmer", null);
__decorate([
    (0, common_1.Get)('parcels/list'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "getParcels", null);
__decorate([
    (0, common_1.Post)('parcels/create'),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "createParcel", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_crop_dto_1.UpdateCropDto, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':cropId/activities'),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Param)('cropId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof activity_dto_1.CreateActivityDto !== "undefined" && activity_dto_1.CreateActivityDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], CropsController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Delete)(':cropId/activities/:activityId'),
    (0, roles_decorator_1.Roles)('agricultor'),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CropsController.prototype, "deleteActivity", null);
exports.CropsController = CropsController = __decorate([
    (0, common_1.Controller)('crops'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [crops_service_1.CropsService,
        tasks_service_1.TasksService])
], CropsController);
//# sourceMappingURL=crops.controller.js.map