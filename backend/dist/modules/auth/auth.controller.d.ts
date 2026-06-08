import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getMe(req: any): Promise<{
        id: number;
        nombre: string;
        email: string;
        telefono: string;
        rol: any;
    }>;
    getProfile(req: any): Promise<{
        id: number;
        nombre: string;
        email: string;
        telefono: string;
        rol: any;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        id: number;
        nombre: string;
        email: string;
        telefono: string;
        rol: any;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<void>;
}
