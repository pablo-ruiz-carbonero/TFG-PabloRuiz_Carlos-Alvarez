// Controlador de autenticación. Expone los endpoints públicos de registro y login,
// y los endpoints protegidos de consulta y actualización de perfil.
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST devuelve 200 (no 201) porque es una operación de autenticación, no de creación de recurso
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/me — usado por la app móvil para obtener el usuario autenticado
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }

  // GET /auth/profile — alias de /auth/me usado por el frontend web
  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }

  // PATCH /auth/profile — actualiza nombre y teléfono del usuario autenticado
  @UseGuards(AuthGuard("jwt"))
  @Patch("profile")
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  // Devuelve 204 porque no hay cuerpo de respuesta tras el cambio de contraseña
  @UseGuards(AuthGuard("jwt"))
  @Post("change-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
