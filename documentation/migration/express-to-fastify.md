# Migrating from Express to Fastify in NestJS

This document outlines the process and reasoning behind migrating our NestJS application from Express to Fastify.

## Why Migrate to Fastify?

According to the [NestJS documentation](https://docs.nestjs.com/techniques/performance), Fastify offers several advantages over Express:

- **Performance**: Fastify is significantly faster than Express, with benchmarks showing up to 2x better performance
- **Lower overhead**: Smaller memory footprint
- **Schema validation**: Built-in JSON Schema validation
- **Improved logging**: Better logging capabilities with Pino integration

## Migration Steps

### 1. Install Required Dependencies

```bash
npm install @nestjs/platform-fastify
npm uninstall @nestjs/platform-express @types/express
```

### 2. Update Main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: true,
    // Additional Fastify options
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  // Listen on all interfaces (not just localhost)
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
```

### 3. DataDog Integration

```typescript
import tracer from 'dd-trace';

tracer.init({
  // DataDog configuration
});

// Use Fastify plugin instead of Express
tracer.use('fastify');
```

## Custom Type Definitions for dd-trace

### Why We Created Custom Type Definitions

We created custom TypeScript type definitions for the `dd-trace` package in `src/types/dd-trace.d.ts` for the following reasons:

1. **Missing Official Types**: The `dd-trace` package doesn't include TypeScript definitions, and there's no official `@types/dd-trace` package available.

2. **TypeScript Compilation Errors**: Without type definitions, TypeScript reports errors when importing and using the package:
   ```
   Cannot find module 'dd-trace' or its corresponding type declarations.
   ```

3. **Type Safety**: Custom type definitions allow TypeScript to properly type-check our code, ensuring we're using the DataDog API correctly.

4. **IDE Support**: Type definitions enable better IDE features like autocompletion, parameter hints, and documentation tooltips.

5. **Maintainability**: Properly typed code is easier to maintain and refactor, reducing the risk of runtime errors.

### Our Custom Type Definition

```typescript
declare module 'dd-trace' {
  interface TracerOptions {
    service?: string;
    env?: string;
    logInjection?: boolean;
    [key: string]: any;
  }

  interface Tracer {
    init(options?: TracerOptions): Tracer;
    use(plugin: string, options?: any): Tracer;
  }

  const tracer: Tracer;
  export default tracer;
}
```

### Configuration in tsconfig.json

We added the custom types directory to the TypeScript configuration:

```json
{
  "compilerOptions": {
    // Other options...
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

## Troubleshooting

If you encounter issues with specific Express middleware or plugins, you may need to find Fastify equivalents or adapt them to work with Fastify's API.

## References

- [NestJS Performance Documentation](https://docs.nestjs.com/techniques/performance)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [DataDog JavaScript Tracer](https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/nodejs/) 