import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebsocketAuthGuard } from './websocket-auth.guard';

/**
 * WebSocket Gateway for handling real-time communication
 * Implements connection, initialization, and disconnection handlers
 */
@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this to your frontend domain
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketGateway.name);

  // Map to store user ID to socket ID mappings
  private userSocketMap = new Map<number, string[]>();

  constructor(private readonly jwtService: JwtService) { }

  @WebSocketServer()
  server: Server;

  /**
   * Lifecycle hook that runs after the gateway is initialized
   * @param server The WebSocket server instance
   */
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  /**
   * Handles new client connections
   * @param client The connected client socket
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Get token from handshake auth or query params
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1] ||
        client.handshake.query.token;

      if (!token) {
        this.disconnect(client, 'No authentication token provided');
        return;
      }

      try {
        // Verify the JWT token
        const payload = await this.jwtService.verifyAsync(token);

        // Attach user data to the socket
        client['user'] = payload;

        // Store the user ID to socket ID mapping
        const userId = payload.sub;
        if (!this.userSocketMap.has(userId)) {
          this.userSocketMap.set(userId, []);
        }
        // Use non-null assertion or optional chaining with nullish coalescing
        const userSockets = this.userSocketMap.get(userId);
        if (userSockets) {
          userSockets.push(client.id);
        }

        this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
      } catch (error) {
        this.disconnect(client, 'Invalid authentication token');
        return;
      }
    } catch (error) {
      this.disconnect(client, 'Error during connection');
    }
  }

  /**
   * Handles client disconnections
   * @param client The disconnected client socket
   */
  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove the socket from the user socket map
    if (client.user) {
      const userId = client.user.sub;
      const userSockets = this.userSocketMap.get(userId);

      if (userSockets) {
        const index = userSockets.indexOf(client.id);
        if (index !== -1) {
          userSockets.splice(index, 1);
        }

        // If no more sockets for this user, remove the user entry
        if (userSockets.length === 0) {
          this.userSocketMap.delete(userId);
        }
      }
    }
  }

  /**
   * Helper method to disconnect a client with a reason
   * @param client The client socket to disconnect
   * @param reason The reason for disconnection
   */
  private disconnect(client: AuthenticatedSocket, reason: string) {
    this.logger.error(`Disconnecting client ${client.id}: ${reason}`);
    client.emit('error', new WsException(reason));
    client.disconnect();
  }

  /**
   * Example message handler
   * @param client The client socket
   * @param payload The message payload
   * @returns Echo of the received message
   */
  @UseGuards(WebsocketAuthGuard)
  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, payload: any): any {
    this.logger.log(`Received message from ${client.id}: ${JSON.stringify(payload)}`);
    return {
      event: 'message',
      data: payload,
    };
  }

  /**
   * Broadcasts a message to all connected clients
   * @param event The event name
   * @param data The data to broadcast
   */
  broadcastToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  /**
   * Sends a message to a specific client
   * @param clientId The client socket ID
   * @param event The event name
   * @param data The data to send
   */
  sendToClient(clientId: string, event: string, data: any): void {
    this.server.to(clientId).emit(event, data);
  }

  /**
   * Sends a message to a specific user (all their connected clients)
   * @param userId The user ID
   * @param event The event name
   * @param data The data to send
   * @returns Boolean indicating if the message was sent to any clients
   */
  sendToUser(userId: number, event: string, data: any): boolean {
    const socketIds = this.userSocketMap.get(userId);

    if (!socketIds || socketIds.length === 0) {
      return false;
    }

    // Send to all connected clients of this user
    socketIds.forEach(socketId => {
      this.sendToClient(socketId, event, data);
    });

    return true;
  }

  /**
   * Gets all connected users
   * @returns Array of user IDs that are currently connected
   */
  getConnectedUsers(): number[] {
    return Array.from(this.userSocketMap.keys());
  }

  /**
   * Sends a message to a specific room
   * @param room The room name
   * @param event The event name
   * @param data The data to send
   */
  sendToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }
}
