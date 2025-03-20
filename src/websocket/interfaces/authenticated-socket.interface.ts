import { Socket } from 'socket.io';

/**
 * Extends the Socket interface to include the user property
 * Used for authenticated WebSocket connections
 */
export interface AuthenticatedSocket extends Socket {
  user?: any;
}
