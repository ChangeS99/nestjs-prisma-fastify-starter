# PIQ Backend Documentation

This directory contains documentation for the PIQ Backend application.

## Migration Guides

- [Express to Fastify Migration](./migration/express-to-fastify.md) - Detailed guide on migrating from Express to Fastify in NestJS
- [Custom Type Definitions](./migration/custom-type-definitions.md) - Explanation of why and how we created custom TypeScript type definitions

## Why We Created Custom Type Definitions for dd-trace

During our migration from Express to Fastify, we needed to create custom TypeScript type definitions for the `dd-trace` package because:

1. **No Official Types**: The `dd-trace` package doesn't include TypeScript definitions, and there's no `@types/dd-trace` package
2. **TypeScript Errors**: Without type definitions, TypeScript reports errors when importing the package
3. **Development Experience**: Type definitions provide better IDE support (autocompletion, parameter hints)
4. **Type Safety**: Properly typed code helps catch errors at compile time rather than runtime
5. **Maintainability**: Type definitions make the code easier to maintain and refactor

For more details, see the [Custom Type Definitions](./migration/custom-type-definitions.md) document. 