// Módulo de conversaciones y mensajería en tiempo real.
// Combina una API REST para historial y un WebSocket gateway (Socket.io) para mensajes en vivo.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { ChatsController } from './chats.controller';
import { MessagesGateway } from './messages.gateway';
import { Conversation } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  // AuthModule se importa para disponer de JwtService en MessagesGateway
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AuthModule],
  // Dos controladores: uno usa el prefijo /conversations, el otro /chats (alias para el web)
  controllers: [ConversationsController, ChatsController],
  // MessagesGateway se registra como provider para que NestJS gestione su ciclo de vida
  providers: [ConversationsService, MessagesGateway],
})
export class ConversationsModule {}
