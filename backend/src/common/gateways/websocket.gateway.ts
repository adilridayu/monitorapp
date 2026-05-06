/**
 * WebSocket Gateway
 * Provides real-time updates to connected clients
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface WebSocketEvent {
  event: string;
  data: any;
  room?: string;
  timestamp: string;
}

@WebSocketGateway({
  cors: true,
  namespace: '/ws',
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedClients = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      // Extract and verify JWT token
      const token = this.extractToken(client);
      if (token) {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        client.data.user = payload;
        
        // Track connection by user/warehouse
        const userId = payload.sub;
        if (!this.connectedClients.has(userId)) {
          this.connectedClients.set(userId, new Set());
        }
        this.connectedClients.get(userId).add(client.id);
        
        this.logger.debug(`Client connected: ${client.id} (User: ${userId})`);
      } else {
        this.logger.warn(`Unauthenticated connection attempt from ${client.id}`);
        client.disconnect();
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.sub;
    if (userId && this.connectedClients.has(userId)) {
      this.connectedClients.get(userId).delete(client.id);
      if (this.connectedClients.get(userId).size === 0) {
        this.connectedClients.delete(userId);
      }
    }
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.debug(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.logger.debug(`Client ${client.id} left room: ${room}`);
  }

  // Broadcast methods for different events
  broadcastStockMovement(movement: any, warehouseId?: string) {
    const event: WebSocketEvent = {
      event: 'STOCK_MOVEMENT_UPDATE',
      data: movement,
      timestamp: new Date().toISOString(),
    };

    if (warehouseId) {
      this.server.to(`warehouse:${warehouseId}`).emit('stock_movement', event);
    } else {
      this.server.emit('stock_movement', event);
    }
  }

  broadcastAiAlert(alert: any, warehouseId?: string) {
    const event: WebSocketEvent = {
      event: 'AI_ALERT',
      data: alert,
      timestamp: new Date().toISOString(),
    };

    if (warehouseId) {
      this.server.to(`warehouse:${warehouseId}`).emit('ai_alert', event);
    } else {
      this.server.emit('ai_alert', event);
    }
  }

  broadcastStockLevel(item: any, warehouseId: string, currentStock: number) {
    const event: WebSocketEvent = {
      event: 'STOCK_LEVEL_UPDATE',
      data: {
        item,
        warehouseId,
        currentStock,
      },
      timestamp: new Date().toISOString(),
    };

    this.server.to(`warehouse:${warehouseId}`).emit('stock_level', event);
  }

  broadcastMonitoringLog(log: any, warehouseId: string) {
    const event: WebSocketEvent = {
      event: 'MONITORING_UPDATE',
      data: log,
      timestamp: new Date().toISOString(),
    };

    this.server.to(`warehouse:${warehouseId}`).emit('monitoring', event);
  }

  // Helper methods
  private extractToken(client: Socket): string | undefined {
    const authHeader = client.handshake.auth.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return client.handshake.query.token as string;
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.server.engine.clientsCount;
  }

  // Get clients by warehouse
  getClientsInWarehouse(warehouseId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`warehouse:${warehouseId}`);
    return room ? room.size : 0;
  }
}