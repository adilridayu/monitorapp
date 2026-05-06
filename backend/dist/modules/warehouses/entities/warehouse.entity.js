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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const stock_movement_entity_1 = require("../../stock-movements/entities/stock-movement.entity");
const monitoring_schedule_entity_1 = require("../../monitoring/entities/monitoring-schedule.entity");
const monitoring_log_entity_1 = require("../../monitoring/entities/monitoring-log.entity");
const ai_alert_entity_1 = require("../../ai-alerts/entities/ai-alert.entity");
let Warehouse = class Warehouse {
    get fullAddress() {
        const parts = [this.address, this.city, this.country].filter(Boolean);
        return parts.join(', ');
    }
};
exports.Warehouse = Warehouse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Warehouse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        unique: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Warehouse.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        default: 'Indonesia',
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Warehouse.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_movement_entity_1.StockMovement, (movement) => movement.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "stockMovements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => monitoring_schedule_entity_1.MonitoringSchedule, (schedule) => schedule.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "monitoringSchedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => monitoring_log_entity_1.MonitoringLog, (log) => log.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "monitoringLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ai_alert_entity_1.AiAlert, (alert) => alert.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "aiAlerts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Warehouse.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Warehouse.prototype, "updated_at", void 0);
exports.Warehouse = Warehouse = __decorate([
    (0, typeorm_1.Entity)('warehouses')
], Warehouse);
//# sourceMappingURL=warehouse.entity.js.map