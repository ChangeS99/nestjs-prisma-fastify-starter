import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Authentication service that handles user login, registration, and token management
 */
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    /**
     * Generates JWT tokens (access and refresh) for a user
     * @param userId User ID to include in the token payload
     * @param email User email to include in the token payload
     * @returns Object containing access and refresh tokens
     */
    async generateTokens(userId: number, email: string) {
        // Define payload for JWT tokens
        const payload = { sub: userId, email };

        // Generate access token (short-lived)
        const accessToken = await this.jwtService.signAsync(payload);

        // Generate refresh token (long-lived) with different expiration
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d', // Refresh token valid for 7 days by default
        });

        // Store the hashed refresh token in the database
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    /**
     * Validates user credentials and generates tokens on successful login
     * @param email User email
     * @param password User password
     * @returns Object containing user info and tokens
     */
    async login(email: string, password: string) {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        // If user doesn't exist or password doesn't match, throw error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens for the authenticated user
        const tokens = await this.generateTokens(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            ...tokens,
        };
    }

    /**
     * Registers a new user and generates tokens
     * @param email User email
     * @param password User password
     * @param name Optional user name
     * @returns Object containing user info and tokens
     */
    async register(email: string, password: string, name?: string) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Generate tokens for the new user
        const tokens = await this.generateTokens(newUser.id, newUser.email);

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
            ...tokens,
        };
    }

    /**
     * Refreshes the access token using a valid refresh token
     * @param userId User ID
     * @param refreshToken Current refresh token
     * @returns Object containing new access and refresh tokens
     */
    async refreshTokens(userId: number, refreshToken: string) {
        // Find user by ID
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        // If user doesn't exist or doesn't have a refresh token, throw error
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access denied');
        }

        // Verify that the provided refresh token matches the stored one
        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Generate new tokens
        return this.generateTokens(user.id, user.email);
    }

    /**
     * Validates a JWT token and returns the payload
     * @param token JWT token to validate
     * @returns Token payload if valid
     */
    async validateToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Logs out a user by invalidating their refresh token
     * @param userId User ID
     */
    async logout(userId: number) {
        // Remove refresh token from database
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });

        return { message: 'Logout successful' };
    }
} 