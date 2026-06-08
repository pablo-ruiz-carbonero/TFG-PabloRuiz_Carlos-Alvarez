// Adaptador REST para el frontend web. Expone el mismo ConversationsService bajo el prefijo /chats
// con los nombres de ruta y el esquema de body que espera el cliente web (a diferencia de /conversations).
import {
  Controller, Get, Post, Put, Body, Param,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';
import { ConversationsService } from './conversations.service';
import { SendMessageDto } from './dto/conversation.dto';

// DTO local con la estructura que envía el web ({senderId, receiverId, contenido})
// en lugar del {text} genérico de SendMessageDto
class WebSendMessageDto {
  @IsString() senderId: string;
  @IsString() receiverId: string;
  @IsString() contenido: string;
}

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // GET /chats/user/:userId → alias de GET /conversations (userId del JWT, param ignorado)
  @Get('user/:userId')
  getChats(@Request() req: any) {
    return this.conversationsService.findAll(req.user.id);
  }

  // POST /chats/messages {senderId, receiverId, content}
  // Encuentra o crea la conversación con receiverId y envía el mensaje
  @Post('messages')
  async sendMessage(@Body() dto: WebSendMessageDto, @Request() req: any) {
    const receiverId = parseInt(dto.receiverId);
    const conv = await this.conversationsService.getOrCreate(req.user.id, {
      participant_id: receiverId,
    });
    return this.conversationsService.sendMessage(
      parseInt(conv.id),
      req.user.id,
      { text: dto.contenido },
    );
  }

  // PUT /chats/:chatId/read → alias de PATCH /conversations/:id/read
  @Put(':chatId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(@Param('chatId') chatId: string, @Request() req: any) {
    return this.conversationsService.markAsRead(+chatId, req.user.id);
  }
}
