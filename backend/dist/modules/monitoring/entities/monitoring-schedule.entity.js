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
exports.MonitoringSchedule = exports.MonitoringFrequency = void 0;
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("../../warehouses/entities/warehouse.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const monitoring_log_entity_1 = require("./monitoring-log.entity");
var MonitoringFrequency;
(function (MonitoringFrequency) {
    MonitoringFrequency["DAILY"] = "DAILY";
    MonitoringFrequency["WEEKLY"] = "WEEKLY";
    MonitoringFrequency["MONTHLY"] = "MONTHLY";
})(MonitoringFrequency || (exports.MonitoringFrequency = MonitoringFrequency = {}));
let MonitoringSchedule = class MonitoringSchedule {
    isDue() {
        if (!this.is_active)
            return false;
        return new Date() >= new Date(this.next_scheduled_date);
    }
    isActive() {
        return this.is_active;
    }
    deactivate() {
        this.is_active = false;
    }
    activate() {
        this.is_active = true;
    }
    getNextScheduleDate() {
        const current = new Date(this.next_scheduled_date);
        const next = new Date(current);
        switch (this.frequency) {
            case MonitoringFrequency.DAILY:
                next.setDate(next.getDate() + 1);
                break;
            case MonitoringFrequency.WEEKLY:
                next.setDate(next.getDate() + 7);
                break;
            case MonitoringFrequency.MONTHLY:
                next.setMonth(next.getMonth() + 1);
                break;
        }
        return next;
    }
    updateNextSchedule() {
        this.next_scheduled_date = this.getNextScheduleDate();
    }
};
exports.MonitoringSchedule = MonitoringSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MonitoringSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MonitoringSchedule.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.monitoringSchedules),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], MonitoringSchedule.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MonitoringFrequency,
    }),
    __metadata("design:type", String)
], MonitoringSchedule.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
    }),
    __metadata("design:type", Date)
], MonitoringSchedule.prototype, "next_scheduled_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], MonitoringSchedule.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    __metadata("design:type", String)
], MonitoringSchedule.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], MonitoringSchedule.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => monitoring_log_entity_1.MonitoringLog, (log) => log.schedule),
    __metadata("design:type", Array)
], MonitoringSchedule.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], MonitoringSchedule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], MonitoringSchedule.prototype, "updated_at", void 0);
exports.MonitoringSchedule = MonitoringSchedule = __decorate([
    (0, typeorm_1.Entity)('monitoring_schedules')
], MonitoringSchedule);
//# sourceMappingURL=monitoring-schedule.entity.js.map