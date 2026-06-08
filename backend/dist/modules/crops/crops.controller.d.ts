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
    getParcels(req: any): Promise<{
        id: number;
        nombre: string;
        ubicacion: string;
        tamano: number;
    }[]>;
    createParcel(body: {
        nombre: string;
        ubicacion?: string;
        tamano?: number;
    }, req: any): any;
    findOne(id: string, req: any): Promise<import("../../database/entities/crop.entity").Crop>;
    update(id: string, updateCropDto: UpdateCropDto, req: any): Promise<import("../../database/entities/crop.entity").Crop>;
    remove(id: string, req: any): Promise<void>;
    createActivity(cropId: string, dto: CreateActivityDto, req: any): Promise<any>;
    deleteActivity(activityId: string, req: any): Promise<void>;
}
