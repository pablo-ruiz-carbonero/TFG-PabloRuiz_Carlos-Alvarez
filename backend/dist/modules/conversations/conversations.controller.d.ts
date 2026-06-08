import { ConversationsService } from './conversations.service';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    findAll(req: any): Promise<{
        id: string;
        participantId: any;
        participantName: string;
        participantInitials: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        online: boolean;
    }[]>;
    getOrCreate(dto: CreateConversationDto, req: any): Promise<{
        id: string;
        participantId: any;
        participantName: string;
        participantInitials: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        online: boolean;
    }>;
    markAsRead(id: string, req: any): Promise<void>;
    getMessages(id: string, req: any): Promise<{
        id: string;
        senderId: any;
        text: string;
        timestamp: Date;
        read: boolean;
    }[]>;
    sendMessage(id: string, dto: SendMessageDto, req: any): Promise<{
        id: string;
        senderId: string;
        text: string;
        timestamp: Date;
        read: boolean;
        conversationId: string;
    }>;
}
