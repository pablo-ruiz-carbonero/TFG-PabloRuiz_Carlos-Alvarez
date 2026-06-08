import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../database/entities/user.entity";
import { Role } from "../../database/entities/role.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            nombre: string;
            email: string;
            telefono: string;
            rol: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            nombre: string;
            email: string;
            telefono: string;
            rol: any;
        };
    }>;
    getMe(userId: number): Promise<{
        id: number;
        nombre: string;
        email: string;
        telefono: string;
        rol: any;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        nombre: string;
        email: string;
        telefono: string;
        rol: any;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<void>;
    private generarToken;
    private serializarUser;
}
