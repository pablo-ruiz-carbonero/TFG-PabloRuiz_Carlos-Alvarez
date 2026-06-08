import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("../../database/entities/product.entity").Product[]>;
    findMine(req: any): Promise<import("../../database/entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../../database/entities/product.entity").Product>;
    create(dto: CreateProductDto, req: any): Promise<import("../../database/entities/product.entity").Product>;
    update(id: string, dto: UpdateProductDto, req: any): Promise<import("../../database/entities/product.entity").Product>;
    remove(id: string, req: any): Promise<void>;
}
