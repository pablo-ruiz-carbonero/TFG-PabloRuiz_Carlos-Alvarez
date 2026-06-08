import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('mensajes')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Conversation', 'mensajes')
  @JoinColumn({ name: 'conversacion_id' })
  conversacion: Conversation;

  @ManyToOne('User')
  @JoinColumn({ name: 'emisor_id' })
  emisor: User;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'tinyint', default: 0 })
  leido: boolean;

  @CreateDateColumn({ name: 'fecha_envio' })
  fechaEnvio: Date;
}
