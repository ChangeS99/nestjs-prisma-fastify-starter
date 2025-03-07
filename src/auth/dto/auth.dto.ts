import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for login requests
 */
export class LoginDto {
    /**
     * User email - must be a valid email format
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
     * User password - must not be empty
     */
    @IsNotEmpty()
    @IsString()
    password: string;
}

/**
 * Data Transfer Object for registration requests
 */
export class RegisterDto {
    /**
     * User email - must be a valid email format
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
     * User password - must be at least 6 characters long
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    /**
     * User name - optional
     */
    @IsOptional()
    @IsString()
    name?: string;
}

/**
 * Data Transfer Object for refresh token requests
 */
export class RefreshTokenDto {
    /**
     * User ID
     */
    @IsNotEmpty()
    userId: number;

    /**
     * Refresh token
     */
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
} 