import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Alt Platform API")
    .setDescription("API documentation for the Alt Platform monorepo")
    .setVersion("0.0.1")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
    .addCookieAuth("session", {
      type: "apiKey",
      in: "cookie",
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("/docs", app, document);

  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);
}

bootstrap();
