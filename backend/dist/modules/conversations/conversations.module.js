"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const conversations_service_1 = require("./conversations.service");
const conversations_controller_1 = require("./conversations.controller");
const chats_controller_1 = require("./chats.controller");
const messages_gateway_1 = require("./messages.gateway");
const conversation_entity_1 = require("../../database/entities/conversation.entity");
const message_entity_1 = require("../../database/entities/message.entity");
const auth_module_1 = require("../auth/auth.module");
let ConversationsModule = class ConversationsModule {
};
exports.ConversationsModule = ConversationsModule;
exports.ConversationsModule = ConversationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([conversation_entity_1.Conversation, message_entity_1.Message]), auth_module_1.AuthModule],
        controllers: [conversations_controller_1.ConversationsController, chats_controller_1.ChatsController],
        providers: [conversations_service_1.ConversationsService, messages_gateway_1.MessagesGateway],
    })
], ConversationsModule);
//# sourceMappingURL=conversations.module.js.map