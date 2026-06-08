import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
    findMine(userId: number): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(dto: CreateProductDto, userId: number): Promise<Product>;
    update(id: number, dto: UpdateProductDto, userId: number): Promise<Product>;
    remove(id: number, userId: number): Promise<void>;
}
