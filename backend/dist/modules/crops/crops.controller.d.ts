import { CropsService } from './crops.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';
import { CreateActivityDto } from './dto/activity.dto';
export declare class CropsController {
    private readonly cropsService;
    private readonly tasksService;
    constructor(cropsService: CropsService, tasksService: TasksService);
    create(createCropDto: CreateCropDto, req: any): Promise<import("../../database/entities/crop.entity").Crop>;
    findAll(req: any): Promise<import("../../database/entities/crop.entity").Crop[]>;
    findByFarmer(req: any): Promise<import("../../database/entities/crop.entity").Crop[]>;
    getParcels(req: any): Promise<import("../../database/entities/parcela.entity").Parcela[]>;
    createParcel(body: {
        nombre: string;
        ubicacion?: string;
        tamano?: number;
    }, req: any): Promise<import("../../database/entities/parcela.entity").Parcela>;
    findOne(id: string, req: any): Promise<import("../../database/entities/crop.entity").Crop>;
    update(id: string, updateCropDto: UpdateCropDto, req: any): Promise<import("../../database/entities/crop.entity").Crop>;
    remove(id: string, req: any): Promise<void>;
    createActivity(cropId: string, dto: CreateActivityDto, req: any): Promise<{
        id: any;
        cropId: any;
        type: string;
        date: any;
        details: any;
        quantity: any;
        unit: any;
    }>;
    deleteActivity(activityId: string, req: any): Promise<void>;
}
