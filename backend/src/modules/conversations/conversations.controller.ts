// Controlador REST de conversaciones. Gestiona el ciclo de vida de las conversaciones
// y el historial de mensajes. La entrega en tiempo real la realiza MessagesGateway.
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Devuelve todas las conversaciones del usuario autenticado con el último mensaje
  @Get()
  findAll(@Request() req: any) {
    return this.conversationsService.findAll(req.user.id);
  }

  // Crea una nueva conversación o devuelve la existente con el participante indicado
  @Post()
  getOrCreate(@Body() dto: CreateConversationDto, @Request() req: any) {
    return this.conversationsService.getOrCreate(req.user.id, dto);
  }

  // Marca la conversación como leída; devuelve 204 sin cuerpo de respuesta
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.conversationsService.markAsRead(+id, req.user.id);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string, @Request() req: any) {
    return this.conversationsService.getMessages(+id, req.user.id);
  }

  // Guarda el mensaje y lo emite por WebSocket al destinatario
  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Request() req: any) {
    return this.conversationsService.sendMessage(+id, req.user.id, dto);
  }
}
