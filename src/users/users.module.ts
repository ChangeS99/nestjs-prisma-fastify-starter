import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Module for user-related functionality
 */
@Module({
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
