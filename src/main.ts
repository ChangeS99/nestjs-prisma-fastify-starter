import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import './datadog';

async function bootstrap() {
  // Create Fastify instance with additional options
  const fastifyAdapter = new FastifyAdapter({
    logger: true,
    // You can add more Fastify options here
    // https://www.fastify.io/docs/latest/Reference/Server/#factory
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  // other config...

  // Enable CORS if needed
  app.enableCors();

  // To listen on all interfaces instead of just localhost
  try {
    await app.listen(3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

bootstrap();
