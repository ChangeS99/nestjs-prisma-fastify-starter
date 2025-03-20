import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Set up global validation pipe with class transformer enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable class transformer
      whitelist: false, // Allow properties not in the DTO
      forbidNonWhitelisted: false, // Don't throw errors for non-whitelisted properties
      validateCustomDecorators: true,
      stopAtFirstError: false, // Collect all errors instead of stopping at first one
      disableErrorMessages: false, // Keep error messages enabled
      errorHttpStatusCode: 400, // Use 400 Bad Request for validation errors
    }),
  );

  // Enable CORS for both HTTP and WebSocket
  app.enableCors({
    origin: '*', // In production, restrict this to your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // To listen on all interfaces instead of just localhost
  try {
    await app.listen(3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

bootstrap();
