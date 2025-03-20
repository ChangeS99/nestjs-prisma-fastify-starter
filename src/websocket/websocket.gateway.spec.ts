import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';
import { WsException } from '@nestjs/websockets';

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGateway,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should authenticate a client with a valid token', async () => {
      const mockClient = {
        id: 'test-client-id',
        handshake: {
          auth: { token: 'valid-token' },
          headers: {},
          query: {},
        },
        disconnect: jest.fn(),
        emit: jest.fn(),
      } as unknown as AuthenticatedSocket;

      const mockPayload = { sub: 1, email: 'test@example.com' };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      await gateway.handleConnection(mockClient);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(mockClient['user']).toEqual(mockPayload);
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('should disconnect a client with no token', async () => {
      const mockClient = {
        id: 'test-client-id',
        handshake: {
          auth: {},
          headers: {},
          query: {},
        },
        disconnect: jest.fn(),
        emit: jest.fn(),
      } as unknown as AuthenticatedSocket;

      await gateway.handleConnection(mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'error',
        expect.any(WsException),
      );
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should disconnect a client with an invalid token', async () => {
      const mockClient = {
        id: 'test-client-id',
        handshake: {
          auth: { token: 'invalid-token' },
          headers: {},
          query: {},
        },
        disconnect: jest.fn(),
        emit: jest.fn(),
      } as unknown as AuthenticatedSocket;

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

      await gateway.handleConnection(mockClient);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid-token');
      expect(mockClient.emit).toHaveBeenCalledWith(
        'error',
        expect.any(WsException),
      );
      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleMessage', () => {
    it('should echo back the received message', () => {
      const mockClient = {
        id: 'test-client-id',
        user: { sub: 1 },
      } as unknown as AuthenticatedSocket;

      const payload = { content: 'Hello, server!' };
      const result = gateway.handleMessage(mockClient, payload);

      expect(result).toEqual({
        event: 'message',
        data: payload,
      });
    });
  });
});
