import { User } from './user.entity';
export declare class Conversation {
    id: number;
    usuarioA: User;
    usuarioB: User;
    leidoA: boolean;
    leidoB: boolean;
    fechaCreacion: Date;
    mensajes: any[];
}
