// DTOs de mensajería. participant_name e participant_initials son opcionales porque el servicio
// los resuelve desde la BD; se admiten para que el cliente pueda cachearlos sin otra consulta.
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsNumber()
  participant_id: number;

  @IsString()
  @IsOptional()
  participant_name?: string;

  @IsString()
  @IsOptional()
  participant_initials?: string;
}

export class SendMessageDto {
  @IsString()
  text: string;
}
