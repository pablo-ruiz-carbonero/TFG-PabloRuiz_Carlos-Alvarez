import { ProductionsService } from './productions.service';
import { CreateProductionDto, UpdateProductionDto } from './dto/production.dto';
export declare class ProductionsController {
    private readonly productionsService;
    constructor(productionsService: ProductionsService);
    findAll(req: any): Promise<import("../../database/entities/production.entity").Production[]>;
    findByCrop(cropId: string, req: any): Promise<import("../../database/entities/production.entity").Production[]>;
    create(dto: CreateProductionDto, req: any): Promise<import("../../database/entities/production.entity").Production>;
    update(id: string, dto: UpdateProductionDto, req: any): Promise<import("../../database/entities/production.entity").Production>;
    remove(id: string, req: any): Promise<void>;
}
