// Servicio de cultivos. Toda consulta filtra por userId para que cada agricultor
// solo acceda a sus propios cultivos.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from '../../database/entities/crop.entity';
import { Parcela } from '../../database/entities/parcela.entity';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    @InjectRepository(Parcela)
    private readonly parcelaRepository: Repository<Parcela>,
  ) {}

  async findAll(userId: number) {
    const rows = await this.cropRepository
      .createQueryBuilder('crop')
      .leftJoinAndSelect('crop.usuario', 'usuario')
      .leftJoinAndSelect('crop.tareas', 'tareas')
      .leftJoinAndSelect('crop.parcela', 'parcela')
      .where('usuario.id = :userId', { userId })
      .getMany();

    return rows;
  }

  async findOne(id: number, userId: number): Promise<Crop> {
    const crop = await this.cropRepository
      .createQueryBuilder('crop')
      .leftJoinAndSelect('crop.usuario', 'usuario')
      .leftJoinAndSelect('crop.tareas', 'tareas')
      .leftJoinAndSelect('crop.parcela', 'parcela')
      .where('crop.id = :id AND usuario.id = :userId', { id, userId })
      .getOne();

    if (!crop) throw new NotFoundException('Cultivo no encontrado');
    return crop;
  }

  async create(createCropDto: CreateCropDto, userId: number): Promise<Crop> {
    const crop = this.cropRepository.create({
      ...createCropDto,
      usuario: { id: userId } as any, // referencia parcial; TypeORM resuelve la FK sin cargar la entidad
    });
    return this.cropRepository.save(crop);
  }

  // findOne verifica la propiedad antes de actualizar, lo que evita que un usuario modifique cultivos ajenos
  async update(id: number, updateCropDto: UpdateCropDto, userId: number): Promise<Crop> {
    const crop = await this.findOne(id, userId);
    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  async remove(id: number, userId: number): Promise<void> {
    const crop = await this.findOne(id, userId);
    await this.cropRepository.remove(crop);
  }

  // Devuelve las parcelas del usuario para asignarlas a los cultivos en el formulario
  async getParcels(userId: number): Promise<Parcela[]> {
    return this.parcelaRepository.find({
      where: { usuario: { id: userId } },
    });
  }

  async createParcel(userId: number, data: { nombre: string; ubicacion?: string; tamano?: number }): Promise<Parcela> {
    const parcela = this.parcelaRepository.create({
      ...data,
      usuario: { id: userId } as any,
    });
    return this.parcelaRepository.save(parcela);
  }
}
