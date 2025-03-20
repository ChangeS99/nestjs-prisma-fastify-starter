import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for handling notifications
 */
@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
  ) { }

  /**
   * Creates a notification and sends it to the specified user
   * @param userId The ID of the user to notify
   * @param message The notification message
   * @param type The type of notification
   * @returns The created notification
   */
  async createNotification(userId: number, message: string, type: string) {
    // Store the notification in the database (assuming you have a Notification model)
    // If you don't have a Notification model yet, you can add it to your Prisma schema

    // For now, we'll just create a simple notification object
    const notification = {
      id: Date.now(), // Temporary ID
      userId,
      message,
      type,
      createdAt: new Date(),
      read: false,
    };

    // Send the notification to the specific user using the WebsocketGateway
    const sent = this.websocketGateway.sendToUser(userId, 'notification', notification);

    // If user is not connected, we'll log it (in a real app, you might queue it for later delivery)
    if (!sent) {
      console.log(`User ${userId} is not connected. Notification will be delivered when they connect.`);
    }

    return notification;
  }

  /**
   * Sends a notification to all users
   * @param message The notification message
   * @param type The type of notification
   * @returns The created notification
   */
  async broadcastNotification(message: string, type: string) {
    const notification = {
      id: Date.now(),
      message,
      type,
      createdAt: new Date(),
      global: true,
    };

    // Broadcast to all connected clients
    this.websocketGateway.broadcastToAll('notification', notification);

    return notification;
  }
}
