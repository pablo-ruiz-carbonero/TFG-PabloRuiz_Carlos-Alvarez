// Entidad que representa la tabla "cultivos". Guarda toda la información agronómica
// de un cultivo: variedad, superficie, fechas de siembra y cosecha, riego y fertilización.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('cultivos')
export class Crop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  variedad: string;

  @Column({ length: 50 })
  tipo_cultivo: string;

  // Superficie en hectáreas con dos decimales
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  superficie: number;

  @Column({ type: 'date' })
  fecha_siembra: Date;

  @Column({ length: 50, nullable: true })
  fase_actual: string;

  @Column({ type: 'date', nullable: true })
  fecha_cosecha_esperada: Date;

  // Producción estimada en kg
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  produccion_esperada: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'date', nullable: true })
  ultimo_riego: Date;

  @Column({ type: 'date', nullable: true })
  ultima_fertilizacion: Date;

  // Intervalo de riego en días; permite calcular próximas fechas en el frontend
  @Column({ type: 'int', nullable: true })
  dias_riego: number;

  @Column({ type: 'int', nullable: true })
  dias_fertilizacion: number;

  // Estado del cultivo: 'active' o 'harvested'
  @Column({ length: 20, default: 'active' })
  status: string;

  // Relación con el usuario dueño del cultivo
  @ManyToOne('User')
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  // FK a la parcela; la relación se carga explícitamente cuando se necesita el nombre
  @Column({ name: 'parcela_id', nullable: true })
  parcelaId: number;

  @ManyToOne('Parcela', { nullable: true, eager: false })
  @JoinColumn({ name: 'parcela_id' })
  parcela: any;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  // Relación inversa con las tareas del cultivo; se usa string para evitar importación circular
  @OneToMany('Task', 'cultivo')
  tareas: any[];
}