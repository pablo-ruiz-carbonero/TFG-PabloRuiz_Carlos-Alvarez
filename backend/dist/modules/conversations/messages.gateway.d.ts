import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(userId: number, client: Socket): void;
    emitNewMessage(toUserId: number, message: any): void;
}
