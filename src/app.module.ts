import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LiveModule } from './live/live.module';

/**
 * Main application module that imports all other modules
 */
@Module({
  imports: [UsersModule, AuthModule, PrismaModule, WebsocketModule, NotificationsModule, LiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
