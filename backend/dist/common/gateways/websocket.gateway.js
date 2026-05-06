"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
Object.defineProperty(exports, "WebSocketGateway", { enumerable: true, get: function () { return websockets_1.WebSocketGateway; } });
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let WebSocketGateway = WebSocketGateway_1 = class WebSocketGateway {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(WebSocketGateway_1.name);
        this.connectedClients = new Map();
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client, ...args) {
        try {
            const token = this.extractToken(client);
            if (token) {
                const payload = this.jwtService.verify(token, {
                    secret: this.configService.get('JWT_SECRET'),
                });
                client.data.user = payload;
                const userId = payload.sub;
                if (!this.connectedClients.has(userId)) {
                    this.connectedClients.set(userId, new Set());
                }
                this.connectedClients.get(userId).add(client.id);
                this.logger.debug(`Client connected: ${client.id} (User: ${userId})`);
            }
            else {
                this.logger.warn(`Unauthenticated connection attempt from ${client.id}`);
                client.disconnect();
            }
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.user?.sub;
        if (userId && this.connectedClients.has(userId)) {
            this.connectedClients.get(userId).delete(client.id);
            if (this.connectedClients.get(userId).size === 0) {
                this.connectedClients.delete(userId);
            }
        }
        this.logger.debug(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(client, room) {
        client.join(room);
        this.logger.debug(`Client ${client.id} joined room: ${room}`);
    }
    handleLeaveRoom(client, room) {
        client.leave(room);
        this.logger.debug(`Client ${client.id} left room: ${room}`);
    }
    broadcastStockMovement(movement, warehouseId) {
        const event = {
            event: 'STOCK_MOVEMENT_UPDATE',
            data: movement,
            timestamp: new Date().toISOString(),
        };
        if (warehouseId) {
            this.server.to(`warehouse:${warehouseId}`).emit('stock_movement', event);
        }
        else {
            this.server.emit('stock_movement', event);
        }
    }
    broadcastAiAlert(alert, warehouseId) {
        const event = {
            event: 'AI_ALERT',
            data: alert,
            timestamp: new Date().toISOString(),
        };
        if (warehouseId) {
            this.server.to(`warehouse:${warehouseId}`).emit('ai_alert', event);
        }
        else {
            this.server.emit('ai_alert', event);
        }
    }
    broadcastStockLevel(item, warehouseId, currentStock) {
        const event = {
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
    broadcastMonitoringLog(log, warehouseId) {
        const event = {
            event: 'MONITORING_UPDATE',
            data: log,
            timestamp: new Date().toISOString(),
        };
        this.server.to(`warehouse:${warehouseId}`).emit('monitoring', event);
    }
    extractToken(client) {
        const authHeader = client.handshake.auth.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return client.handshake.query.token;
    }
    getConnectedClientsCount() {
        return this.server.engine.clientsCount;
    }
    getClientsInWarehouse(warehouseId) {
        const room = this.server.sockets.adapter.rooms.get(`warehouse:${warehouseId}`);
        return room ? room.size : 0;
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], websockets_1.WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], websockets_1.WebSocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], websockets_1.WebSocketGateway.prototype, "handleLeaveRoom", null);
exports.WebSocketGateway = websockets_1.WebSocketGateway = WebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], websockets_1.WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map