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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("../../database/entities/conversation.entity");
const message_entity_1 = require("../../database/entities/message.entity");
const messages_gateway_1 = require("./messages.gateway");
let ConversationsService = class ConversationsService {
    constructor(convRepository, messageRepository, messagesGateway) {
        this.convRepository = convRepository;
        this.messageRepository = messageRepository;
        this.messagesGateway = messagesGateway;
    }
    async findAll(userId) {
        const conversations = await this.convRepository
            .createQueryBuilder('conv')
            .leftJoinAndSelect('conv.usuarioA', 'ua')
            .leftJoinAndSelect('conv.usuarioB', 'ub')
            .leftJoin((qb) => qb
            .select('m.conversacion_id', 'cid')
            .addSelect('m.contenido', 'contenido')
            .addSelect('m.fecha_envio', 'fecha')
            .from('mensajes', 'm')
            .where('m.id = (SELECT MAX(m2.id) FROM mensajes m2 WHERE m2.conversacion_id = m.conversacion_id)'), 'last', 'last.cid = conv.id')
            .addSelect('last.contenido', 'last_contenido')
            .addSelect('last.fecha', 'last_fecha')
            .where('ua.id = :userId OR ub.id = :userId', { userId })
            .orderBy('conv.fechaCreacion', 'DESC')
            .getRawAndEntities();
        const { entities, raw } = conversations;
        return entities.map((conv, i) => {
            const isA = conv.usuarioA.id === userId;
            const participant = isA ? conv.usuarioB : conv.usuarioA;
            const unread = isA ? !conv.leidoA : !conv.leidoB;
            const lastMsg = raw[i]?.last_contenido ?? '';
            const lastDate = raw[i]?.last_fecha
                ? this.formatTime(new Date(raw[i].last_fecha))
                : '';
            const nombre = participant.nombre ?? participant.email ?? '';
            return {
                id: conv.id.toString(),
                participantId: participant.id.toString(),
                participantName: nombre,
                participantInitials: this.initials(nombre),
                lastMessage: lastMsg,
                lastMessageTime: lastDate,
                unreadCount: unread ? 1 : 0,
                online: false,
            };
        });
    }
    async getOrCreate(userId, dto) {
        const participantId = dto.participant_id;
        const existing = await this.convRepository
            .createQueryBuilder('conv')
            .leftJoinAndSelect('conv.usuarioA', 'ua')
            .leftJoinAndSelect('conv.usuarioB', 'ub')
            .where('(ua.id = :userId AND ub.id = :pid) OR (ua.id = :pid AND ub.id = :userId)', { userId, pid: participantId })
            .getOne();
        if (existing)
            return this.serializeConv(existing, userId);
        const conv = this.convRepository.create({
            usuarioA: { id: userId },
            usuarioB: { id: participantId },
        });
        const saved = await this.convRepository.save(conv);
        const full = await this.convRepository.findOne({
            where: { id: saved.id },
            relations: ['usuarioA', 'usuarioB'],
        });
        return this.serializeConv(full, userId);
    }
    async markAsRead(convId, userId) {
        const conv = await this.convRepository.findOne({
            where: { id: convId },
            relations: ['usuarioA', 'usuarioB'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversación no encontrada');
        const isA = conv.usuarioA.id === userId;
        const isB = conv.usuarioB.id === userId;
        if (!isA && !isB)
            throw new common_1.ForbiddenException();
        if (isA)
            conv.leidoA = true;
        else
            conv.leidoB = true;
        await this.convRepository.save(conv);
    }
    async getMessages(convId, userId) {
        const conv = await this.convRepository.findOne({
            where: { id: convId },
            relations: ['usuarioA', 'usuarioB'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversación no encontrada');
        this.assertParticipant(conv, userId);
        const messages = await this.messageRepository.find({
            where: { conversacion: { id: convId } },
            relations: ['emisor'],
            order: { fechaEnvio: 'ASC' },
        });
        return messages.map((m) => ({
            id: m.id.toString(),
            senderId: m.emisor.id.toString(),
            text: m.contenido,
            timestamp: m.fechaEnvio,
            read: m.leido,
        }));
    }
    async sendMessage(convId, userId, dto) {
        const conv = await this.convRepository.findOne({
            where: { id: convId },
            relations: ['usuarioA', 'usuarioB'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversación no encontrada');
        this.assertParticipant(conv, userId);
        const isA = conv.usuarioA.id === userId;
        if (isA)
            conv.leidoB = false;
        else
            conv.leidoA = false;
        await this.convRepository.save(conv);
        const message = this.messageRepository.create({
            conversacion: { id: convId },
            emisor: { id: userId },
            contenido: dto.text,
        });
        const saved = await this.messageRepository.save(message);
        const payload = {
            id: saved.id.toString(),
            senderId: userId.toString(),
            text: saved.contenido,
            timestamp: saved.fechaEnvio,
            read: false,
            conversationId: convId.toString(),
        };
        const otherUserId = isA
            ? conv.usuarioB.id
            : conv.usuarioA.id;
        this.messagesGateway.emitNewMessage(otherUserId, payload);
        return payload;
    }
    assertParticipant(conv, userId) {
        const isA = conv.usuarioA.id === userId;
        const isB = conv.usuarioB.id === userId;
        if (!isA && !isB)
            throw new common_1.ForbiddenException('No eres participante de esta conversación');
    }
    serializeConv(conv, userId) {
        const isA = conv.usuarioA.id === userId;
        const participant = isA ? conv.usuarioB : conv.usuarioA;
        const nombre = participant.nombre ?? participant.email ?? '';
        return {
            id: conv.id.toString(),
            participantId: participant.id.toString(),
            participantName: nombre,
            participantInitials: this.initials(nombre),
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0,
            online: false,
        };
    }
    initials(nombre) {
        if (!nombre)
            return '??';
        return nombre
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() ?? '')
            .join('');
    }
    formatTime(date) {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
        if (diffDays === 0)
            return date.toTimeString().slice(0, 5);
        if (diffDays === 1)
            return 'Ayer';
        if (diffDays < 7)
            return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => messages_gateway_1.MessagesGateway))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        messages_gateway_1.MessagesGateway])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map