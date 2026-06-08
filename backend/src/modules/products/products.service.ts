// Servicio del marketplace de productos. findAll es público (sin filtro de usuario);
// las operaciones de escritura comprueban la propiedad del producto antes de ejecutarse.
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Lista todos los productos del marketplace ordenados por fecha de publicación
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['usuario'],
      order: { fechaPublicacion: 'DESC' },
    });
  }

  // Devuelve solo los productos publicados por el usuario autenticado
  async findMine(userId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { usuario: { id: userId } },
      relations: ['usuario'],
      order: { fechaPublicacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['usuario'], // se carga la relación para poder verificar la propiedad en update/remove
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(dto: CreateProductDto, userId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      usuario: { id: userId } as any, // referencia parcial; TypeORM resuelve la FK
    });
    return this.productRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto, userId: number): Promise<Product> {
    const product = await this.findOne(id);
    // Se compara el id del usuario cargado con el del token para garantizar la propiedad
    if ((product.usuario as any).id !== userId) {
      throw new ForbiddenException('No puedes editar este producto');
    }
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: number, userId: number): Promise<void> {
    const product = await this.findOne(id);
    if ((product.usuario as any).id !== userId) {
      throw new ForbiddenException('No puedes eliminar este producto');
    }
    await this.productRepository.remove(product);
  }
}
