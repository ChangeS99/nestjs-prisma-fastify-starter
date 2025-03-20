import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

/**
 * Enum for notification types
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * Data Transfer Object for creating notifications
 */
export class CreateNotificationDto {
  /**
   * The notification message
   */
  @IsNotEmpty({ message: 'Message is required' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  /**
   * The notification type
   */
  @IsOptional()
  @IsEnum(NotificationType, { message: 'Type must be one of: info, success, warning, error' })
  type: NotificationType = NotificationType.INFO;
}
