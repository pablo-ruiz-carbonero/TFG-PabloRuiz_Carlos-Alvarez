import { User } from './user.entity';
export declare class Product {
    id: number;
    usuario: User;
    nombre: string;
    categoria: string;
    descripcion: string;
    precio: number;
    unidad: string;
    stock: number;
    provincia: string;
    imagenes: string[];
    fechaPublicacion: Date;
}
