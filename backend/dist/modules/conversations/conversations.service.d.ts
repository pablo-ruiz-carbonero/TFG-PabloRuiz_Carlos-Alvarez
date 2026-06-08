import { Repository } from 'typeorm';
import { Conversation } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';
import { MessagesGateway } from './messages.gateway';
export declare class ConversationsService {
    private readonly convRepository;
    private readonly messageRepository;
    private readonly messagesGateway;
    constructor(convRepository: Repository<Conversation>, messageRepository: Repository<Message>, messagesGateway: MessagesGateway);
    findAll(userId: number): Promise<{
        id: string;
        participantId: any;
        participantName: string;
        participantInitials: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        online: boolean;
    }[]>;
    getOrCreate(userId: number, dto: CreateConversationDto): Promise<{
        id: string;
        participantId: any;
        participantName: string;
        participantInitials: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        online: boolean;
    }>;
    markAsRead(convId: number, userId: number): Promise<void>;
    getMessages(convId: number, userId: number): Promise<{
        id: string;
        senderId: any;
        text: string;
        timestamp: Date;
        read: boolean;
    }[]>;
    sendMessage(convId: number, userId: number, dto: SendMessageDto): Promise<{
        id: string;
        senderId: string;
        text: string;
        timestamp: Date;
        read: boolean;
        conversationId: string;
    }>;
    private assertParticipant;
    private serializeConv;
    private initials;
    private formatTime;
}
