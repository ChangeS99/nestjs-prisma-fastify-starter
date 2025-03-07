import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                JwtService,
                PrismaService,
                UsersService,
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should call authService.login with correct parameters', async () => {
            // Arrange
            const loginDto = { email: 'test@example.com', password: 'password123' };
            const expectedResult = {
                user: { id: 1, email: 'test@example.com', name: 'Test User' },
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            };

            jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.login(loginDto);

            // Assert
            expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('register', () => {
        it('should call authService.register with correct parameters', async () => {
            // Arrange
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            };
            const expectedResult = {
                user: { id: 1, email: 'test@example.com', name: 'Test User' },
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            };

            jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.register(registerDto);

            // Assert
            expect(authService.register).toHaveBeenCalledWith(
                registerDto.email,
                registerDto.password,
                registerDto.name
            );
            expect(result).toEqual(expectedResult);
        });
    });
}); 