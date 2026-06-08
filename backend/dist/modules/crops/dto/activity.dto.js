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
exports.CreateActivityDto = exports.TAREA_TO_ACTIVITY = exports.ACTIVITY_TO_TAREA = void 0;
exports.taskToActivity = taskToActivity;
const class_validator_1 = require("class-validator");
exports.ACTIVITY_TO_TAREA = {
    irrigation: 'riego',
    fertilization: 'fertilizacion',
    harvest: 'cosecha',
    pest: 'plaguicida',
};
exports.TAREA_TO_ACTIVITY = {
    riego: 'irrigation',
    fertilizacion: 'fertilization',
    cosecha: 'harvest',
    plaguicida: 'pest',
    siembra: 'pest',
};
class CreateActivityDto {
}
exports.CreateActivityDto = CreateActivityDto;
__decorate([
    (0, class_validator_1.IsEnum)(['irrigation', 'fertilization', 'harvest', 'pest']),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateActivityDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "unit", void 0);
function taskToActivity(task, cropId) {
    return {
        id: task.id.toString(),
        cropId: (task.cultivo?.id ?? task.cultivo_id ?? cropId ?? '').toString(),
        type: exports.TAREA_TO_ACTIVITY[task.tipo] ?? 'pest',
        date: task.fecha,
        details: task.descripcion ?? '',
        quantity: task.cantidad ?? undefined,
        unit: task.unidad ?? undefined,
    };
}
//# sourceMappingURL=activity.dto.js.map