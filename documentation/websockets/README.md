# WebSocket Implementation

This document describes the WebSocket implementation in the NestJS Prisma Fastify Starter Template.

## Overview

The WebSocket implementation uses Socket.io with NestJS's built-in WebSocket support. It provides real-time bidirectional communication between the server and clients.

## Features

- **Authentication**: WebSocket connections are authenticated using JWT tokens
- **Event-based Communication**: Uses Socket.io's event system for message passing
- **Room Support**: Clients can join and leave rooms for group communication
- **Error Handling**: Proper error handling and client disconnection

## Architecture

The WebSocket implementation consists of the following components:

1. **WebsocketModule**: The main module that registers the WebSocket gateway
2. **WebsocketGateway**: Handles WebSocket connections, disconnections, and messages
3. **WebsocketAuthGuard**: Guards WebSocket routes to ensure authentication
4. **DTOs**: Data Transfer Objects for WebSocket messages

## Authentication

WebSocket connections are authenticated using JWT tokens. The token can be provided in one of three ways:

1. In the handshake auth object: `{ auth: { token: 'your-jwt-token' } }`
2. In the handshake headers: `Authorization: Bearer your-jwt-token`
3. In the query parameters: `?token=your-jwt-token`

## Events

### Server Events (sent to clients)

- `error`: Sent when an error occurs
- `message`: Response to a client message

### Client Events (sent from clients)

- `message`: Send a message to the server

## Example Usage

### Connecting to the WebSocket Server

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

### Sending Messages

```javascript
socket.emit('message', { content: 'Hello, server!' });
```

### Receiving Messages

```javascript
socket.on('message', (data) => {
  console.log('Received message:', data);
});
```

## Testing

An example HTML client is provided in `examples/websocket-client.html` for testing the WebSocket implementation.

## Security Considerations

- In production, restrict the CORS origin to your frontend domain
- Use HTTPS for secure WebSocket connections (WSS)
- Implement rate limiting to prevent abuse
- Consider implementing message validation using class-validator
