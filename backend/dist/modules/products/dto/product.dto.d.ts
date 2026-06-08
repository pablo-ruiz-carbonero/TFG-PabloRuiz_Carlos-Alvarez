export declare class CreateProductDto {
    nombre: string;
    categoria: string;
    descripcion?: string;
    precio: number;
    unidad: string;
    stock: number;
    provincia?: string;
    imagenes?: string[];
}
export declare class UpdateProductDto {
    nombre?: string;
    categoria?: string;
    descripcion?: string;
    precio?: number;
    unidad?: string;
    stock?: number;
    provincia?: string;
    imagenes?: string[];
}
