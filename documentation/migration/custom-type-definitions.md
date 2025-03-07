# Custom Type Definitions in TypeScript Projects

This document explains why and how we create custom type definitions for third-party packages that don't include their own TypeScript definitions.

## Why We Created Custom Type Definitions for dd-trace

During our migration from Express to Fastify in our NestJS application, we encountered TypeScript errors when using the `dd-trace` package:

```
Cannot find module 'dd-trace' or its corresponding type declarations.
```

We created custom type definitions for the following reasons:

### 1. No Official Type Definitions

The `dd-trace` package doesn't ship with TypeScript definitions, and there's no official `@types/dd-trace` package available in the DefinitelyTyped repository.

### 2. TypeScript Compilation Requirements

TypeScript requires type definitions for all imported modules to properly type-check your code. Without these definitions, TypeScript can't verify that you're using the API correctly.

### 3. Development Experience

Custom type definitions provide several benefits:
- **IDE autocompletion**: Suggests methods and properties as you type
- **Parameter hints**: Shows expected parameter types
- **Documentation tooltips**: Displays type information on hover
- **Refactoring support**: Makes it safer to rename or move code

### 4. Error Prevention

Properly typed code helps catch errors at compile time rather than runtime, reducing bugs and improving code quality.

## How We Implemented the Type Definitions

### 1. Created a Declaration File

We created a `.d.ts` file in a custom types directory:

```typescript
// src/types/dd-trace.d.ts
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

### 2. Updated TypeScript Configuration

We added our custom types directory to the `typeRoots` in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

## Creating Type Definitions for Other Packages

If you need to create type definitions for other untyped packages, follow these steps:

### 1. Check if Types Already Exist

Before creating custom types, check if official types exist:
```bash
npm search @types/package-name
```

### 2. Create a Declaration File

Create a file named `package-name.d.ts` in your custom types directory:

```typescript
declare module 'package-name' {
  // Define interfaces, types, and exports based on the package's API
  
  // Example:
  export function someFunction(param: string): number;
  
  export interface SomeInterface {
    property: string;
    method(): void;
  }
  
  // For default exports:
  const defaultExport: SomeType;
  export default defaultExport;
}
```

### 3. Start with Minimal Definitions

You don't need to type the entire API at once. Start with just the parts you use and expand as needed.

### 4. Use Documentation

Refer to the package's documentation to understand the expected types and behavior.

### 5. Consider Contributing

If your type definitions are comprehensive, consider contributing them to DefinitelyTyped so others can benefit.

## Best Practices

1. **Keep definitions minimal**: Only define what you actually use
2. **Update as needed**: Expand definitions when you use more of the package
3. **Document assumptions**: Add comments explaining any assumptions you've made
4. **Version compatibility**: Note which version of the package your types are for

## References

- [TypeScript Declaration Files Documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [DefinitelyTyped Contribution Guide](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/README.md)
- [DataDog JavaScript Tracer Documentation](https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/nodejs/) 