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
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const conversations_service_1 = require("./conversations.service");
const conversation_dto_1 = require("./dto/conversation.dto");
let ConversationsController = class ConversationsController {
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    findAll(req) {
        return this.conversationsService.findAll(req.user.id);
    }
    getOrCreate(dto, req) {
        return this.conversationsService.getOrCreate(req.user.id, dto);
    }
    markAsRead(id, req) {
        return this.conversationsService.markAsRead(+id, req.user.id);
    }
    getMessages(id, req) {
        return this.conversationsService.getMessages(+id, req.user.id);
    }
    sendMessage(id, dto, req) {
        return this.conversationsService.sendMessage(+id, req.user.id, dto);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [conversation_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getOrCreate", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, conversation_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "sendMessage", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, common_1.Controller)('conversations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
//# sourceMappingURL=conversations.controller.js.map