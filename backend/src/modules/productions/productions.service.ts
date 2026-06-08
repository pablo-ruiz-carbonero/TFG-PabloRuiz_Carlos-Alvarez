// Servicio de producciones (cosechas). La propiedad se verifica a través del cultivo asociado,
// cargando la relación cultivo.usuario antes de comprobar el userId.
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Production } from '../../database/entities/production.entity';
import { CreateProductionDto, UpdateProductionDto } from './dto/production.dto';

@Injectable()
export class ProductionsService {
  constructor(
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
  ) {}

  // Devuelve los registros de producción de un cultivo concreto filtrando también por usuario
  async findByCrop(cropId: number, userId: number): Promise<Production[]> {
    return this.productionRepository.find({
      where: { cultivo: { id: cropId, usuario: { id: userId } } },
      relations: ['cultivo'],
      order: { fecha: 'DESC' },
    });
  }

  // Devuelve todos los registros de producción de todos los cultivos del usuario
  async findAll(userId: number): Promise<Production[]> {
    return this.productionRepository.find({
      where: { cultivo: { usuario: { id: userId } } },
      relations: ['cultivo'],
      order: { fecha: 'DESC' },
    });
  }

  async create(dto: CreateProductionDto, userId: number): Promise<Production> {
    const production = this.productionRepository.create({
      cantidad: dto.cantidad,
      fecha: dto.fecha,
      cultivo: { id: dto.cultivo_id } as any, // referencia parcial para la FK cultivo_id
    });
    return this.productionRepository.save(production);
  }

  async update(id: number, dto: UpdateProductionDto, userId: number): Promise<Production> {
    // Se cargan cultivo y cultivo.usuario para poder verificar la propiedad en la misma consulta
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['cultivo', 'cultivo.usuario'],
    });
    if (!production) throw new NotFoundException('Producción no encontrada');
    if (production.cultivo.usuario.id !== userId) throw new ForbiddenException();
    Object.assign(production, dto);
    return this.productionRepository.save(production);
  }

  async remove(id: number, userId: number): Promise<void> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['cultivo', 'cultivo.usuario'],
    });
    if (!production) throw new NotFoundException('Producción no encontrada');
    if (production.cultivo.usuario.id !== userId) throw new ForbiddenException();
    await this.productionRepository.remove(production);
  }
}
