import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global Prisma module that provides the PrismaService throughout the application
 * Using @Global() decorator to make the module available application-wide without importing it in each module
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { } 