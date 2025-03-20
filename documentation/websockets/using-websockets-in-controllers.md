# Using WebSockets in Controllers

This guide explains how to use the WebSocket functionality in other controllers of your NestJS application.

## Overview

The WebSocket implementation in this project allows you to:

1. Send real-time messages to all connected clients
2. Send messages to specific users
3. Track connected users
4. Create rooms for group communication

## Setup

### 1. Import the WebsocketModule

First, import the WebsocketModule in your feature module:

```typescript
import { Module } from '@nestjs/common';
import { YourController } from './your.controller';
import { YourService } from './your.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [YourController],
  providers: [YourService],
})
export class YourModule {}
```

### 2. Inject the WebsocketGateway

Inject the WebsocketGateway into your controller or service:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller('your-endpoint')
export class YourController {
  constructor(private readonly websocketGateway: WebsocketGateway) {}
  
  // Controller methods...
}
```

## Usage Examples

### Broadcasting to All Clients

```typescript
@Post('broadcast')
broadcastMessage(@Body() body: { message: string }) {
  this.websocketGateway.broadcastToAll('event-name', {
    message: body.message,
    timestamp: new Date(),
  });
  
  return { success: true };
}
```

### Sending to a Specific User

```typescript
@Post('notify-user/:userId')
notifyUser(
  @Param('userId', ParseIntPipe) userId: number,
  @Body() body: { message: string }
) {
  const sent = this.websocketGateway.sendToUser(userId, 'notification', {
    message: body.message,
    timestamp: new Date(),
  });
  
  return { 
    success: sent,
    message: sent ? 'Notification sent' : 'User not connected'
  };
}
```

### Sending to a Room

```typescript
@Post('room-message/:roomName')
sendToRoom(
  @Param('roomName') roomName: string,
  @Body() body: { message: string }
) {
  this.websocketGateway.sendToRoom(roomName, 'room-message', {
    room: roomName,
    message: body.message,
    timestamp: new Date(),
  });
  
  return { success: true };
}
```

### Getting Connected Users

```typescript
@Get('connected-users')
getConnectedUsers() {
  const users = this.websocketGateway.getConnectedUsers();
  return { users, count: users.length };
}
```

## Real-World Example: Notification System

A common use case is sending notifications to users when certain events occur. Here's how you can implement it:

```typescript
// In your service
async createResource(data: any, createdBy: number) {
  // Create the resource in the database
  const resource = await this.prismaService.resource.create({
    data: {
      ...data,
      createdById: createdBy,
    },
  });
  
  // Notify all users who should be informed
  if (resource.assignedToId) {
    this.websocketGateway.sendToUser(
      resource.assignedToId,
      'resource-assigned',
      {
        resourceId: resource.id,
        resourceName: resource.name,
        message: `You have been assigned to ${resource.name}`,
      }
    );
  }
  
  return resource;
}
```

## Best Practices

1. **Use Typed Events**: Define interfaces for your event payloads to ensure type safety
2. **Handle Offline Users**: Check the return value of `sendToUser()` to know if the message was delivered
3. **Separate Concerns**: Put WebSocket logic in services rather than controllers when possible
4. **Error Handling**: Wrap WebSocket operations in try-catch blocks to prevent failures from affecting HTTP responses
5. **Security**: Always validate user permissions before sending sensitive data

## Conclusion

By following this guide, you can easily integrate real-time WebSocket communication into your existing controllers and services. This enables you to build interactive features like notifications, chat, live updates, and more.
