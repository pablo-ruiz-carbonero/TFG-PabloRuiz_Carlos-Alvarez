// Servicio de conversaciones y mensajes. Combina persistencia en MySQL con emisión
// de eventos en tiempo real a través de MessagesGateway (Socket.io).
import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    // forwardRef rompe la dependencia circular entre ConversationsService y MessagesGateway,
    // ya que el gateway también necesita al servicio en algunos escenarios
    @Inject(forwardRef(() => MessagesGateway))
    private readonly messagesGateway: MessagesGateway,
  ) {}

  // Devuelve todas las conversaciones del usuario con el último mensaje y el estado de lectura
  async findAll(userId: number) {
    const conversations = await this.convRepository
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.usuarioA', 'ua')
      .leftJoinAndSelect('conv.usuarioB', 'ub')
      // Subconsulta para obtener el último mensaje de cada conversación sin cargar todos los mensajes
      .leftJoin(
        (qb) =>
          qb
            .select('m.conversacion_id', 'cid')
            .addSelect('m.contenido', 'contenido')
            .addSelect('m.fecha_envio', 'fecha')
            .from('mensajes', 'm')
            .where(
              'm.id = (SELECT MAX(m2.id) FROM mensajes m2 WHERE m2.conversacion_id = m.conversacion_id)',
            ),
        'last',
        'last.cid = conv.id',
      )
      .addSelect('last.contenido', 'last_contenido')
      .addSelect('last.fecha', 'last_fecha')
      .where('ua.id = :userId OR ub.id = :userId', { userId })
      .orderBy('conv.fechaCreacion', 'DESC')
      .getRawAndEntities(); // getRawAndEntities es necesario para acceder a los campos del SELECT adicional

    const { entities, raw } = conversations;

    return entities.map((conv, i) => {
      // Determina qué participante es el interlocutor (el que no es el usuario autenticado)
      const isA = (conv.usuarioA as any).id === userId;
      const participant = isA ? conv.usuarioB : conv.usuarioA;
      const unread = isA ? !conv.leidoA : !conv.leidoB;

      const lastMsg: string = raw[i]?.last_contenido ?? '';
      const lastDate: string = raw[i]?.last_fecha
        ? this.formatTime(new Date(raw[i].last_fecha))
        : '';

      // Usa el email como fallback si el usuario no tiene nombre configurado
      const nombre: string = (participant as any).nombre ?? (participant as any).email ?? '';

      return {
        id: conv.id.toString(),
        participantId: (participant as any).id.toString(),
        participantName: nombre,
        participantInitials: this.initials(nombre),
        lastMessage: lastMsg,
        lastMessageTime: lastDate,
        unreadCount: unread ? 1 : 0,
        online: false, // presencia en tiempo real no implementada; siempre false
      };
    });
  }

  // Devuelve la conversación existente entre los dos usuarios o crea una nueva si no existe
  async getOrCreate(userId: number, dto: CreateConversationDto) {
    const participantId = dto.participant_id;

    // Busca en ambas direcciones: userId puede ser usuarioA o usuarioB
    const existing = await this.convRepository
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.usuarioA', 'ua')
      .leftJoinAndSelect('conv.usuarioB', 'ub')
      .where(
        '(ua.id = :userId AND ub.id = :pid) OR (ua.id = :pid AND ub.id = :userId)',
        { userId, pid: participantId },
      )
      .getOne();

    if (existing) return this.serializeConv(existing, userId);

    const conv = this.convRepository.create({
      usuarioA: { id: userId } as any,
      usuarioB: { id: participantId } as any,
    });
    const saved = await this.convRepository.save(conv);
    // Se recarga con relaciones para poder serializar los datos de los participantes
    const full = await this.convRepository.findOne({
      where: { id: saved.id },
      relations: ['usuarioA', 'usuarioB'],
    });
    return this.serializeConv(full!, userId);
  }

  // Marca la conversación como leída para el usuario autenticado (leidoA o leidoB según su posición)
  async markAsRead(convId: number, userId: number): Promise<void> {
    const conv = await this.convRepository.findOne({
      where: { id: convId },
      relations: ['usuarioA', 'usuarioB'],
    });
    if (!conv) throw new NotFoundException('Conversación no encontrada');

    const isA = (conv.usuarioA as any).id === userId;
    const isB = (conv.usuarioB as any).id === userId;
    if (!isA && !isB) throw new ForbiddenException();

    // Actualiza solo el flag del usuario que hace la petición
    if (isA) conv.leidoA = true;
    else conv.leidoB = true;

    await this.convRepository.save(conv);
  }

  // Devuelve los mensajes de una conversación ordenados cronológicamente
  async getMessages(convId: number, userId: number) {
    const conv = await this.convRepository.findOne({
      where: { id: convId },
      relations: ['usuarioA', 'usuarioB'],
    });
    if (!conv) throw new NotFoundException('Conversación no encontrada');
    this.assertParticipant(conv, userId);

    const messages = await this.messageRepository.find({
      where: { conversacion: { id: convId } },
      relations: ['emisor'],
      order: { fechaEnvio: 'ASC' }, // orden ascendente para mostrar el chat de más antiguo a más reciente
    });

    return messages.map((m) => ({
      id: m.id.toString(),
      senderId: (m.emisor as any).id.toString(),
      text: m.contenido,
      timestamp: m.fechaEnvio,
      read: m.leido,
    }));
  }

  // Guarda el mensaje en BD y lo emite en tiempo real al destinatario a través del WebSocket
  async sendMessage(convId: number, userId: number, dto: SendMessageDto) {
    const conv = await this.convRepository.findOne({
      where: { id: convId },
      relations: ['usuarioA', 'usuarioB'],
    });
    if (!conv) throw new NotFoundException('Conversación no encontrada');
    this.assertParticipant(conv, userId);

    // Marca el mensaje como no leído para el otro participante al enviar
    const isA = (conv.usuarioA as any).id === userId;
    if (isA) conv.leidoB = false;
    else conv.leidoA = false;
    await this.convRepository.save(conv);

    const message = this.messageRepository.create({
      conversacion: { id: convId } as any,
      emisor: { id: userId } as any,
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

    // Emite el evento al otro participante usando su sala personal en el gateway
    const otherUserId = isA
      ? (conv.usuarioB as any).id
      : (conv.usuarioA as any).id;
    this.messagesGateway.emitNewMessage(otherUserId, payload);

    return payload;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  // Lanza ForbiddenException si el userId no es ninguno de los dos participantes de la conversación
  private assertParticipant(conv: Conversation, userId: number) {
    const isA = (conv.usuarioA as any).id === userId;
    const isB = (conv.usuarioB as any).id === userId;
    if (!isA && !isB) throw new ForbiddenException('No eres participante de esta conversación');
  }

  // Transforma una conversación en el formato esperado por los frontends
  private serializeConv(conv: Conversation, userId: number) {
    const isA = (conv.usuarioA as any).id === userId;
    const participant = isA ? conv.usuarioB : conv.usuarioA;
    const nombre: string = (participant as any).nombre ?? (participant as any).email ?? '';
    return {
      id: conv.id.toString(),
      participantId: (participant as any).id.toString(),
      participantName: nombre,
      participantInitials: this.initials(nombre),
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
      online: false,
    };
  }

  // Genera las iniciales del nombre (máximo dos palabras) para el avatar de la lista de chats
  private initials(nombre: string): string {
    if (!nombre) return '??';
    return nombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  // Devuelve una cadena legible según la antigüedad del mensaje: hora, "Ayer", día o fecha corta
  private formatTime(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
    if (diffDays === 0) return date.toTimeString().slice(0, 5); // HH:mm
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }
}
