import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';

/**
 * Controller handling authentication-related endpoints
 */
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Endpoint for user login
     * @param loginDto Login credentials (email and password)
     * @returns User info and authentication tokens
     */
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    /**
     * Endpoint for user registration
     * @param registerDto Registration data (email, password, and optional name)
     * @returns Created user info and authentication tokens
     */
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(
            registerDto.email,
            registerDto.password,
            registerDto.name,
        );
    }

    /**
     * Endpoint for refreshing tokens
     * @param refreshTokenDto Object containing user ID and refresh token
     * @returns New access and refresh tokens
     */
    @Post('refresh')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(
            refreshTokenDto.userId,
            refreshTokenDto.refreshToken,
        );
    }

    /**
     * Endpoint for user logout
     * @param req Request object containing user info
     * @returns Logout confirmation message
     */
    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Req() req) {
        const userId = req.user.sub;
        return this.authService.logout(userId);
    }

    /**
     * Protected endpoint to get the current user's profile
     * @param req Request object containing user info
     * @returns User profile information
     */
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
} 