# NestJS Prisma Fastify Starter Template

This is a basic starter template for building applications with:
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prisma**: A next-generation ORM for Node.js and TypeScript.
- **Fastify**: A fast and low-overhead web framework for Node.js.

## Features
- **Authentication**: JWT-based authentication with access and refresh tokens.
- **Database**: Prisma ORM with SQLite (can be easily switched to other databases).
- **API**: RESTful API structure with Fastify as the underlying HTTP server.
- **Documentation**: Comprehensive documentation in the `documentation` folder.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Prisma CLI

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/nestjs-prisma-fastify-starter.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Documentation
For detailed documentation, check the [documentation folder](./documentation/README.md).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
