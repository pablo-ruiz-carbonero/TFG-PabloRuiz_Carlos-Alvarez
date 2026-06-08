import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('conversaciones')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User')
  @JoinColumn({ name: 'usuario_a_id' })
  usuarioA: User;

  @ManyToOne('User')
  @JoinColumn({ name: 'usuario_b_id' })
  usuarioB: User;

  @Column({ name: 'leido_a', type: 'tinyint', default: 0 })
  leidoA: boolean;

  @Column({ name: 'leido_b', type: 'tinyint', default: 0 })
  leidoB: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany('Message', 'conversacion')
  mensajes: any[];
}
