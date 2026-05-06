"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const ai_log_schema_1 = require("./schemas/ai-log.schema");
const observability_log_schema_1 = require("./schemas/observability-log.schema");
const role_entity_1 = require("../modules/roles/entities/role.entity");
const user_entity_1 = require("../modules/users/entities/user.entity");
const warehouse_entity_1 = require("../modules/warehouses/entities/warehouse.entity");
const item_entity_1 = require("../modules/items/entities/item.entity");
const stock_movement_entity_1 = require("../modules/stock-movements/entities/stock-movement.entity");
const monitoring_schedule_entity_1 = require("../modules/monitoring/entities/monitoring-schedule.entity");
const monitoring_log_entity_1 = require("../modules/monitoring/entities/monitoring-log.entity");
const ai_alert_entity_1 = require("../modules/ai-alerts/entities/ai-alert.entity");
const approval_entity_1 = require("../modules/approvals/entities/approval.entity");
const audit_log_entity_1 = require("../modules/audit/entities/audit-log.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('POSTGRES_HOST', 'localhost'),
                    port: configService.get('POSTGRES_PORT', 5432),
                    username: configService.get('POSTGRES_USER', 'warehouse_admin'),
                    password: configService.get('POSTGRES_PASSWORD', 'password'),
                    database: configService.get('POSTGRES_DB', 'warehouse_db'),
                    entities: [
                        role_entity_1.Role,
                        user_entity_1.User,
                        warehouse_entity_1.Warehouse,
                        item_entity_1.Item,
                        stock_movement_entity_1.StockMovement,
                        monitoring_schedule_entity_1.MonitoringSchedule,
                        monitoring_log_entity_1.MonitoringLog,
                        ai_alert_entity_1.AiAlert,
                        approval_entity_1.Approval,
                        audit_log_entity_1.AuditLog,
                    ],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                    migrationsRun: false,
                    migrationsTransactionMode: 'each',
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
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: ai_log_schema_1.AiLog.name, schema: ai_log_schema_1.AiLogSchema },
                { name: observability_log_schema_1.ObservabilityLog.name, schema: observability_log_schema_1.ObservabilityLogSchema },
            ]),
        ],
        exports: [typeorm_1.TypeOrmModule, mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map