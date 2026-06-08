import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('parcelas')
export class Parcela {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User')
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  ubicacion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tamano: number;
}
