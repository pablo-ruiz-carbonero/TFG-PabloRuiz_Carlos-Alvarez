"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({ origin: true, credentials: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("AgroLink API")
        .setDescription("API REST de la plataforma AgroLink — TFG DAM")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
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
//# sourceMappingURL=main.js.map