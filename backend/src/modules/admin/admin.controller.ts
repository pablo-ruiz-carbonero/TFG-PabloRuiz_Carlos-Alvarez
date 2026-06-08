// Controlador de administración. Todas las rutas requieren JWT y el rol "administrador".
// Los decoradores de Swagger (@ApiTags, @ApiOperation) documentan el panel de admin en /api/docs.
import { Controller, Get, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
// AuthGuard verifica el JWT; RolesGuard comprueba que el rol del payload sea "administrador"
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('administrador')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas globales de la plataforma' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  getUsers() {
    return this.adminService.getUsers();
  }

  // ParseIntPipe convierte el parámetro de ruta a número antes de pasarlo al servicio
  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Cambiar el rol de un usuario' })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('rol') rol: string,
  ) {
    return this.adminService.updateUserRole(id, rol);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('crops')
  @ApiOperation({ summary: 'Listar todos los cultivos de la plataforma' })
  getAllCrops() {
    return this.adminService.getAllCrops();
  }

  @Get('products')
  @ApiOperation({ summary: 'Listar todos los productos del marketplace' })
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Eliminar un producto del marketplace' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }
}
