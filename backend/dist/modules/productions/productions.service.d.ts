import { Repository } from 'typeorm';
import { Production } from '../../database/entities/production.entity';
import { CreateProductionDto, UpdateProductionDto } from './dto/production.dto';
export declare class ProductionsService {
    private readonly productionRepository;
    constructor(productionRepository: Repository<Production>);
    findByCrop(cropId: number, userId: number): Promise<Production[]>;
    findAll(userId: number): Promise<Production[]>;
    create(dto: CreateProductionDto, userId: number): Promise<Production>;
    update(id: number, dto: UpdateProductionDto, userId: number): Promise<Production>;
    remove(id: number, userId: number): Promise<void>;
}
