import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for login requests
 */
export class LoginDto {
    /**
     * User email - must be a valid email format
     */
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    /**
     * User password - must not be empty
     */
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}

/**
 * Data Transfer Object for registration requests
 */
export class RegisterDto {
    /**
     * User email - must be a valid email format
     */
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    /**
     * User password - must be at least 6 characters long
     */
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    /**
     * User name - optional
     */
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;
}

/**
 * Data Transfer Object for refresh token requests
 */
export class RefreshTokenDto {
    /**
     * User ID
     */
    @IsNotEmpty({ message: 'User ID is required' })
    userId: number;

    /**
     * Refresh token
     */
    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}