import { Conversation } from './conversation.entity';
import { User } from './user.entity';
export declare class Message {
    id: number;
    conversacion: Conversation;
    emisor: User;
    contenido: string;
    leido: boolean;
    fechaEnvio: Date;
}
