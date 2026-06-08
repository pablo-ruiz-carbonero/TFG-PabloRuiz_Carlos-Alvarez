// Gateway WebSocket de mensajería en tiempo real. Cada usuario se une a su propia sala
// personal ("user_<id>") para recibir mensajes sin que otros usuarios los intercepten.
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// El namespace /messages separa este gateway de otros posibles gateways WebSocket en la app
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/messages' })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // Valida el token JWT enviado en el handshake; desconecta al cliente si es inválido o falta
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      console.log(`Socket conectado: ${client.id} (user ${payload.sub})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket desconectado: ${client.id}`);
  }

  // El cliente emite el evento "join" con su userId para suscribirse a su sala personal.
  // De esta forma cada usuario solo recibe los mensajes dirigidos a él.
  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    client.join(`user_${userId}`);
  }

  // Método llamado por ConversationsService (no por el cliente) para entregar un mensaje al destinatario
  emitNewMessage(toUserId: number, message: any) {
    this.server.to(`user_${toUserId}`).emit('new_message', message);
  }
}
