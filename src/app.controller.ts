import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly websocketGateway: WebsocketGateway,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Example endpoint that broadcasts a message to all connected clients
   */
  @Post('broadcast')
  broadcastMessage(@Body() body: { event: string; data: any }) {
    this.websocketGateway.broadcastToAll(body.event, body.data);
    return { success: true, message: 'Broadcast sent' };
  }

  /**
   * Example endpoint that sends a message to a specific user
   */
  @Post('send-to-user')
  sendToUser(@Body() body: { userId: number; event: string; data: any }) {
    const sent = this.websocketGateway.sendToUser(body.userId, body.event, body.data);
    return {
      success: sent,
      message: sent ? 'Message sent' : 'User not connected'
    };
  }

  /**
   * Get a list of all connected users
   */
  @Get('connected-users')
  getConnectedUsers() {
    const users = this.websocketGateway.getConnectedUsers();
    return { users, count: users.length };
  }
}
