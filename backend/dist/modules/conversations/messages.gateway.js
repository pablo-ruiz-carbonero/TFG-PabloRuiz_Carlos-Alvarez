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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let MessagesGateway = class MessagesGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token;
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;
            console.log(`Socket conectado: ${client.id} (user ${payload.sub})`);
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Socket desconectado: ${client.id}`);
    }
    handleJoin(userId, client) {
        client.join(`user_${userId}`);
    }
    emitNewMessage(toUserId, message) {
        this.server.to(`user_${toUserId}`).emit('new_message', message);
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoin", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: '/messages' }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map