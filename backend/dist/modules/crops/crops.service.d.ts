import { Repository } from 'typeorm';
import { Crop } from '../../database/entities/crop.entity';
import { Parcela } from '../../database/entities/parcela.entity';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';
export declare class CropsService {
    private readonly cropRepository;
    private readonly parcelaRepository;
    constructor(cropRepository: Repository<Crop>, parcelaRepository: Repository<Parcela>);
    findAll(userId: number): Promise<Crop[]>;
    findOne(id: number, userId: number): Promise<Crop>;
    create(createCropDto: CreateCropDto, userId: number): Promise<Crop>;
    update(id: number, updateCropDto: UpdateCropDto, userId: number): Promise<Crop>;
    remove(id: number, userId: number): Promise<void>;
    getParcels(userId: number): Promise<Parcela[]>;
    createParcel(userId: number, data: {
        nombre: string;
        ubicacion?: string;
        tamano?: number;
    }): Promise<Parcela>;
}
