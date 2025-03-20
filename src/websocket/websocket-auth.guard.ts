import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';

/**
 * Guard for protecting WebSocket routes
 * Checks if the client socket has a valid user object attached
 */
@Injectable()
export class WebsocketAuthGuard implements CanActivate {
  private readonly logger = new Logger(WebsocketAuthGuard.name);

  /**
   * Validates if the client is authenticated
   * @param context The execution context
   * @returns Boolean indicating if the client is authorized
   */
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();

    // Check if user object exists on the socket (set during handleConnection)
    if (!client.user) {
      this.logger.error(`Unauthorized WebSocket access attempt: ${client.id}`);
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
