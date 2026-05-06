import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export interface WebSocketEvent {
    event: string;
    data: any;
    room?: string;
    timestamp: string;
}
export declare class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(jwtService: JwtService, configService: ConfigService);
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, room: string): void;
    handleLeaveRoom(client: Socket, room: string): void;
    broadcastStockMovement(movement: any, warehouseId?: string): void;
    broadcastAiAlert(alert: any, warehouseId?: string): void;
    broadcastStockLevel(item: any, warehouseId: string, currentStock: number): void;
    broadcastMonitoringLog(log: any, warehouseId: string): void;
    private extractToken;
    getConnectedClientsCount(): number;
    getClientsInWarehouse(warehouseId: string): number;
}
