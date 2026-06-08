// Entidad que representa la tabla "productos" del marketplace de AgroLink.
// Cualquier usuario puede publicar productos; la propiedad se verifica en el servicio antes de editar o borrar.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('productos')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Usuario que publicó el producto; se carga con la relación para poder verificar propiedad
  @ManyToOne('User')
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50, nullable: true })
  categoria: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Precio en euros con dos decimales
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ length: 20, nullable: true })
  unidad: string;

  // Cantidad disponible; 0 significa sin stock
  @Column({ type: 'int', default: 0 })
  stock: number;

  // Provincia donde se encuentra el producto; facilita el filtrado geográfico
  @Column({ length: 100, nullable: true })
  provincia: string;

  // URLs de imágenes asociadas al producto; null si no se han subido fotos
  @Column({ type: 'json', nullable: true })
  imagenes: string[];

  @CreateDateColumn({ name: 'fecha_publicacion' })
  fechaPublicacion: Date;
}
