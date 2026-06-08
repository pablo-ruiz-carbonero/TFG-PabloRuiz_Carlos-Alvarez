// Punto de entrada del servidor NestJS. Configura pipes globales, CORS y Swagger antes de arrancar.
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valida y transforma los DTOs recibidos; rechaza campos no declarados en el DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // elimina propiedades sin decoradores de validación
      forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
      transform: true,         // convierte tipos primitivos automáticamente (ej. string -> number)
    }),
  );

  // Permite peticiones desde cualquier origen; necesario para el frontend web y la app móvil
  app.enableCors({ origin: true, credentials: true });

  // Configuración de Swagger: se añade autenticación Bearer para probar rutas protegidas
  const config = new DocumentBuilder()
    .setTitle("AgroLink API")
    .setDescription("API REST de la plataforma AgroLink — TFG DAM")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Escucha en todas las interfaces para que el contenedor Docker sea accesible desde el host
  await app.listen(3000, "0.0.0.0");

  console.log("\n┌─────────────────────────────────────────────────┐");
  console.log("│             🌱  AgroLink — TFG DAM              │");
  console.log("├─────────────────────────────────────────────────┤");
  console.log("│  Frontend    →  http://localhost:5173            │");
  console.log("│  Backend     →  http://localhost:3000            │");
  console.log("│  Swagger     →  http://localhost:3000/api/docs   │");
  console.log("│  MySQL       →  localhost:3310                   │");
  console.log("└─────────────────────────────────────────────────┘\n");
}
bootstrap();
