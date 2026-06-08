import { ConversationsService } from './conversations.service';
declare class WebSendMessageDto {
    senderId: string;
    receiverId: string;
    contenido: string;
}
export declare class ChatsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    getChats(req: any): Promise<{
        id: string;
        participantId: any;
        participantName: string;
        participantInitials: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        online: boolean;
    }[]>;
    sendMessage(dto: WebSendMessageDto, req: any): Promise<{
        id: string;
        senderId: string;
        text: string;
        timestamp: Date;
        read: boolean;
        conversationId: string;
    }>;
    markRead(chatId: string, req: any): Promise<void>;
}
export {};
