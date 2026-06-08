// Entidad que representa la tabla "roles". Los roles posibles son:
// agricultor, distribuidor, proveedor y administrador.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  // Relación inversa con User; se usa string para evitar importación circular
  @OneToMany('User', 'role')
  users: any[];
}