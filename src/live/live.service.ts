import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for handling live view operations
 */
@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user notifications for display
   * @param userId User ID
   * @returns Array of notifications
   */
  async getUserNotifications(userId: number) {
    // In a real implementation, you would fetch notifications from the database
    // For now, we'll return mock data
    return [
      {
        id: 1,
        message: 'Welcome to the application!',
        type: 'info',
        createdAt: new Date(),
        read: false,
      },
      {
        id: 2,
        message: 'Your profile was updated successfully',
        type: 'success',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        read: true,
      },
      {
        id: 3,
        message: 'You have a new message',
        type: 'alert',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
      },
    ];
  }

  /**
   * Get user data for templates
   * @param userId User ID
   * @returns User data
   */
  async getUserData(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
