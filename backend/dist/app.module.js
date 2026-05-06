"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = __importStar(require("cache-manager-redis-yet"));
const app_config_1 = require("./config/app.config");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const warehouses_module_1 = require("./modules/warehouses/warehouses.module");
const items_module_1 = require("./modules/items/items.module");
const stock_movements_module_1 = require("./modules/stock-movements/stock-movements.module");
const monitoring_module_1 = require("./modules/monitoring/monitoring.module");
const ai_alerts_module_1 = require("./modules/ai-alerts/ai-alerts.module");
const approvals_module_1 = require("./modules/approvals/approvals.module");
const audit_module_1 = require("./modules/audit/audit.module");
const websocket_gateway_1 = require("./common/gateways/websocket.gateway");
const health_module_1 = require("./modules/health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
                load: [app_config_1.AppConfig],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('POSTGRES_HOST', 'localhost'),
                    port: configService.get('POSTGRES_PORT', 5432),
                    username: configService.get('POSTGRES_USER', 'warehouse_admin'),
                    password: configService.get('POSTGRES_PASSWORD', 'password'),
                    database: configService.get('POSTGRES_DB', 'warehouse_db'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    subscribers: [__dirname + '/database/subscribers/*{.ts,.js}'],
                    extra: {
                        max: configService.get('DB_POOL_SIZE', 20),
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 2000,
                    },
                    ssl: configService.get('NODE_ENV') === 'production'
                        ? { rejectUnauthorized: false }
                        : false,
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/warehouse_logs'),
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    autoIndex: true,
                    retryAttempts: 3,
                    retryDelay: 3000,
                }),
                inject: [config_1.ConfigService],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    store: redisStore,
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                    password: configService.get('REDIS_PASSWORD'),
                    ttl: configService.get('CACHE_TTL', 300),
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    throttlers: [
                        {
                            name: 'short',
                            ttl: configService.get('RATE_LIMIT_TTL', 60) * 1000,
                            limit: configService.get('RATE_LIMIT_MAX', 100),
                        },
                    ],
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            warehouses_module_1.WarehousesModule,
            items_module_1.ItemsModule,
            stock_movements_module_1.StockMovementsModule,
            monitoring_module_1.MonitoringModule,
            ai_alerts_module_1.AiAlertsModule,
            approvals_module_1.ApprovalsModule,
            audit_module_1.AuditModule,
            health_module_1.HealthModule,
        ],
        providers: [websocket_gateway_1.WebSocketGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map