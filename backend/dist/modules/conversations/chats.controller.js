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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const conversations_service_1 = require("./conversations.service");
class WebSendMessageDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebSendMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebSendMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebSendMessageDto.prototype, "contenido", void 0);
let ChatsController = class ChatsController {
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    getChats(req) {
        return this.conversationsService.findAll(req.user.id);
    }
    async sendMessage(dto, req) {
        const receiverId = parseInt(dto.receiverId);
        const conv = await this.conversationsService.getOrCreate(req.user.id, {
            participant_id: receiverId,
        });
        return this.conversationsService.sendMessage(parseInt(conv.id), req.user.id, { text: dto.contenido });
    }
    markRead(chatId, req) {
        return this.conversationsService.markAsRead(+chatId, req.user.id);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getChats", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WebSendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Put)(':chatId/read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "markRead", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map