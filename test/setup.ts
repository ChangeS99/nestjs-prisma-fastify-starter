import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [PrismaService],
    }).compile();

    const prisma = moduleRef.get(PrismaService);
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
    await prisma.$executeRaw`DELETE FROM User;`;
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
}); 