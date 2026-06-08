// Entidad que representa la tabla "usuarios" en la base de datos.
// Almacena las credenciales y el rol de cada usuario de la plataforma.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  nombre: string;

  @Column({ length: 100, unique: true })
  email: string;

  // Se almacena el hash bcrypt, nunca la contraseña en texto plano
  @Column({ length: 255 })
  password: string;

  // El nombre de columna se especifica explícitamente para que TypeORM no intente
  // adivinarlo; coincide con el schema.sql actualizado
  @Column({ name: "telefono", length: 20, nullable: true })
  telefono: string;

  // Relación como string para evitar dependencias circulares entre entidades
  @ManyToOne("Role")
  @JoinColumn({ name: "rol_id" }) // columna FK en la tabla usuarios
  role: any;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion: Date;
}
