// Servicio de administración. Proporciona estadísticas globales y operaciones de gestión
// sobre usuarios, cultivos y productos de toda la plataforma.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { Crop } from '../../database/entities/crop.entity';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Crop)
    private readonly cropRepo: Repository<Crop>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // Ejecuta los tres COUNT en paralelo para reducir la latencia de la consulta de estadísticas
  async getStats() {
    const [totalUsers, totalCrops, totalProducts] = await Promise.all([
      this.userRepo.count(),
      this.cropRepo.count(),
      this.productRepo.count(),
    ]);

    // Agrupa los usuarios por rol para mostrar la distribución en el panel de administración
    const usersByRole = await this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.role', 'r')
      .select('r.nombre', 'rol')
      .addSelect('COUNT(u.id)', 'total')
      .groupBy('r.nombre')
      .getRawMany();

    return { totalUsers, totalCrops, totalProducts, usersByRole };
  }

  // Devuelve todos los usuarios con su rol; ordenados por fecha de registro descendente
  async getUsers() {
    return this.userRepo.find({
      relations: ['role'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  // Cambia el rol de un usuario buscando primero la entidad Role por nombre
  async updateUserRole(id: number, rolNombre: string) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Se busca el rol por nombre para obtener su id real y asignarlo al usuario
    const role = await this.roleRepo.findOneBy({ nombre: rolNombre });
    if (!role) throw new NotFoundException('Rol no encontrado');

    user.role = role;
    return this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRepo.remove(user);
  }

  // Devuelve todos los cultivos de la plataforma; el administrador no filtra por usuario
  async getAllCrops() {
    return this.cropRepo.find({
      relations: ['usuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async getAllProducts() {
    return this.productRepo.find({
      relations: ['usuario'],
      order: { fechaPublicacion: 'DESC' },
    });
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Producto no encontrado');
    await this.productRepo.remove(product);
  }
}
