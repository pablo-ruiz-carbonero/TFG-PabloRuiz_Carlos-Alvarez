export declare const ACTIVITY_TO_TAREA: Record<string, string>;
export declare const TAREA_TO_ACTIVITY: Record<string, string>;
export declare class CreateActivityDto {
    type: string;
    date: string;
    details: string;
    quantity?: number;
    unit?: string;
}
export declare function taskToActivity(task: any, cropId?: string): {
    id: any;
    cropId: any;
    type: string;
    date: any;
    details: any;
    quantity: any;
    unit: any;
};
