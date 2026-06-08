// Servicio de autenticación. Gestiona el registro, login, consulta de perfil,
// actualización de datos y cambio de contraseña de los usuarios.
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../../database/entities/user.entity";
import { Role } from "../../database/entities/role.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  // Crea un nuevo usuario; si no se indica rol se asigna "agricultor" (id = 1)
  async register(dto: RegisterDto) {
    const existe = await this.userRepository.findOneBy({ email: dto.email });
    if (existe) throw new ConflictException("El email ya está registrado");

    // Factor de coste 10 de bcrypt; equilibrio entre seguridad y rendimiento
    const hashed = await bcrypt.hash(dto.password, 10);

    // Si se especifica un rol en el DTO se busca su id real; si no existe se mantiene el default
    let roleId = 1; // id del rol "agricultor" en la tabla roles
    if (dto.rol) {
      const role = await this.roleRepository.findOneBy({ nombre: dto.rol });
      if (role) roleId = role.id;
    }

    const user = this.userRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      password: hashed,
      role: { id: roleId }, // referencia parcial; TypeORM resuelve la FK sin cargar la entidad completa
    });

    await this.userRepository.save(user);

    // Recargar con la relación "role" para que generarToken pueda leer role.nombre
    const userConRol = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    const accessToken = this.generarToken(userConRol!);

    return {
      accessToken,
      user: this.serializarUser(userConRol!),
    };
  }

  // Verifica credenciales y devuelve un token JWT si son correctas
  async login(dto: LoginDto) {
    // Se carga la relación "role" para poder incluir el nombre del rol en el token
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ["role"],
    });

    if (!user) throw new UnauthorizedException("Credenciales incorrectas");

    const valido = await bcrypt.compare(dto.password, user.password);
    if (!valido) throw new UnauthorizedException("Credenciales incorrectas");

    const accessToken = this.generarToken(user);

    // Mismo campo "accessToken" que en register para consistencia entre frontends
    return {
      accessToken,
      user: this.serializarUser(user),
    };
  }

  // Devuelve los datos del usuario identificado por el id extraído del token JWT
  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["role"],
    });

    if (!user) throw new UnauthorizedException("Usuario no encontrado");

    return this.serializarUser(user);
  }

  // Actualiza nombre y teléfono; acepta tanto los campos en español como sus alias en inglés
  // para dar compatibilidad a la app móvil que usa nombres distintos
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    await this.userRepository.update(userId, {
      nombre: dto.nombre ?? dto.name,       // web envía "nombre", móvil envía "name"
      telefono: dto.telefono ?? dto.phone,  // web envía "telefono", móvil envía "phone"
    });
    return this.getMe(userId);
  }

  // Comprueba la contraseña actual antes de permitir el cambio
  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valido = await bcrypt.compare(dto.current_password, user.password);
    if (!valido) throw new UnauthorizedException('Contraseña actual incorrecta');

    user.password = await bcrypt.hash(dto.new_password, 10);
    await this.userRepository.save(user);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Genera el token JWT con el payload mínimo necesario para autorización
  private generarToken(user: User): string {
    const payload = {
      sub: user.id,           // "sub" es el campo estándar JWT para el identificador del sujeto
      email: user.email,
      rol: user.role?.nombre ?? null, // rol en texto para que RolesGuard pueda compararlo directamente
    };
    return this.jwtService.sign(payload);
  }

  // Devuelve un objeto plano y consistente, sin exponer el hash de la contraseña
  private serializarUser(user: User) {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono ?? null,
      rol: user.role?.nombre ?? null,
    };
  }
}
