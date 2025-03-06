# Prisma ORM

## Overview
Prisma is a next-generation ORM for Node.js and TypeScript. It provides a type-safe database client, automated migrations, and a powerful query builder.

## Installation
```bash
npm install prisma @prisma/client
```

## Usage
- Initialize Prisma:
  ```bash
  npx prisma init
  ```
- Generate Prisma Client:
  ```bash
  npx prisma generate
  ```

## Multi-File Schema Support
Prisma allows you to split your schema into multiple files for better organization. This feature is available via the `prismaSchemaFolder` preview feature.

### How to Enable Multi-File Schema
1. Add the `prismaSchemaFolder` feature flag to your `schema.prisma` file:
   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["prismaSchemaFolder"]
   }
   ```

2. Create a `schema` folder inside the `prisma` directory:
   ```
   prisma/
   ├─ schema/
   │  ├─ user.prisma
   │  ├─ post.prisma
   │  ├─ schema.prisma
   ```

3. Split your schema into multiple files. For example:
   - **`user.prisma`**:
     ```prisma
     model User {
       id    Int    @id @default(autoincrement())
       email String @unique
       name  String?
     }
     ```
   - **`post.prisma`**:
     ```prisma
     model Post {
       id      Int    @id @default(autoincrement())
       title   String
       content String?
       userId  Int
       user    User   @relation(fields: [userId], references: [id])
     }
     ```

4. Regenerate the Prisma client:
   ```bash
   npx prisma generate
   ```

### Best Practices
- **Organize by Domain**: Group related models into the same file (e.g., `user.prisma` for user-related models).
- **Clear Naming**: Use descriptive file names like `user.prisma` or `post.prisma`.
- **Main Schema File**: Keep the `datasource` and `generator` blocks in a single "main" file (e.g., `schema.prisma`).

## Resources
- [Prisma Documentation](https://www.prisma.io/docs)
- [Multi-File Schema Guide](https://www.prisma.io/docs/orm/prisma-schema/overview/location) 