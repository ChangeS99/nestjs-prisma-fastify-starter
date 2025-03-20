import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for WebSocket messages
 */
export class MessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  room?: string;
}
