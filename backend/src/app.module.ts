// Módulo raíz de la aplicación. Registra la conexión a MySQL y agrupa todos los módulos de dominio.
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CropsModule } from './modules/crops/crops.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProductsModule } from './modules/products/products.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ProductionsModule } from './modules/productions/productions.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Carga las variables de entorno (.env) y las expone globalmente en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión asíncrona a MySQL; lee las credenciales desde ConfigService para no harcodearlas
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'), // el + convierte el string de env a número
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // descubre entidades automáticamente
        synchronize: false, // en producción se usa migraciones, no sincronización automática
      }),
    }),

    AuthModule,
    CropsModule,
    TasksModule,
    ProductsModule,
    ConversationsModule,
    ProductionsModule,
    AdminModule,
  ],
})
export class AppModule {}
