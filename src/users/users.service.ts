import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * Service for managing user operations
 */
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Creates a new user with hashed password
     * @param email User email
     * @param password User password
     * @param name Optional user name
     * @returns Created user object
     */
    async createUser(email: string, password: string, name?: string) {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            },
        });
    }

    /**
     * Retrieves all users from the database
     * @returns Array of user objects
     */
    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                // Exclude password and refreshToken for security
            }
        });
    }

    /**
     * Finds a user by email
     * @param email User email to search for
     * @returns User object if found, null otherwise
     */
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * Finds a user by ID
     * @param id User ID to search for
     * @returns User object if found, null otherwise
     */
    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Updates a user's refresh token
     * @param userId User ID
     * @param refreshToken New refresh token (or null to clear)
     * @returns Updated user object
     */
    async updateRefreshToken(userId: number, refreshToken: string | null) {
        let data: any = { refreshToken: null };

        // If refreshToken is provided, hash it before storing
        if (refreshToken) {
            const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
            data = { refreshToken: hashedRefreshToken };
        }

        return this.prisma.user.update({
            where: { id: userId },
            data
        });
    }
} 