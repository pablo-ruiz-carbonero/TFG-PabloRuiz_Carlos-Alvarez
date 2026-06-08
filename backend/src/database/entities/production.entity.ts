// Entidad que representa la tabla "producciones". Registra cada cosecha obtenida
// de un cultivo, con la cantidad recolectada y la fecha correspondiente.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('producciones')
export class Production {
  @PrimaryGeneratedColumn()
  id: number;

  // Cultivo al que pertenece este registro de producción; se usa string para evitar importación circular
  @ManyToOne('Crop')
  @JoinColumn({ name: 'cultivo_id' })
  cultivo: any;

  // Cantidad cosechada en kg
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  // Fecha de la cosecha; se almacena como string 'YYYY-MM-DD' según el tipo DATE de MySQL
  @Column({ type: 'date' })
  fecha: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
