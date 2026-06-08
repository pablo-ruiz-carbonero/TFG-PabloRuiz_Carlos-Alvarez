// Módulo de administración. Restringido al rol "administrador" mediante RolesGuard.
// Importa AuthModule para reutilizar JwtModule y PassportModule en la verificación del token.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { Crop } from '../../database/entities/crop.entity';
import { Product } from '../../database/entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Se necesitan las cuatro entidades para las estadísticas y la gestión de usuarios/contenido
    TypeOrmModule.forFeature([User, Role, Crop, Product]),
    PassportModule,
    AuthModule, // exporta JwtModule para que AuthGuard('jwt') funcione en este módulo
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
