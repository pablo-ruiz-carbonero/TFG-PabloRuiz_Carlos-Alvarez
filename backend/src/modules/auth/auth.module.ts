// Módulo de autenticación. Configura Passport con la estrategia JWT y expone
// JwtModule para que otros módulos puedan verificar tokens si lo necesitan.
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';

@Module({
  imports: [
    // Se necesita Role para buscar el id del rol por nombre durante el registro
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    // Configuración asíncrona para leer JWT_SECRET y JWT_EXPIRES desde las variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // Se exporta JwtModule para que AdminModule y otros puedan reusar la verificación JWT
  exports: [JwtModule],
})
export class AuthModule {}