import { Body, Controller, Post, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

/**
 * Controller for handling notification endpoints
 */
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) { }

  /**
   * Endpoint for sending a notification to a specific user
   * @param userId The ID of the user to notify
   * @param body The notification data
   * @returns The created notification
   */
  @UseGuards(AuthGuard)
  @Post('user/:userId')
  async notifyUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { message: string; type: string },
  ) {
    return this.notificationsService.createNotification(
      userId,
      body.message,
      body.type,
    );
  }

  /**
   * Endpoint for broadcasting a notification to all users
   * @param body The notification data
   * @returns The created notification
   */
  @UseGuards(AuthGuard)
  @Post('broadcast')
  async broadcastNotification(@Body() body: { message: string; type: string }) {
    return this.notificationsService.broadcastNotification(
      body.message,
      body.type,
    );
  }
}
