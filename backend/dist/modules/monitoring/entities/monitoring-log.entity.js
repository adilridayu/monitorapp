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
exports.MonitoringLog = exports.InspectionResult = void 0;
const typeorm_1 = require("typeorm");
const monitoring_schedule_entity_1 = require("./monitoring-schedule.entity");
const warehouse_entity_1 = require("../../warehouses/entities/warehouse.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var InspectionResult;
(function (InspectionResult) {
    InspectionResult["PASS"] = "PASS";
    InspectionResult["FAIL"] = "FAIL";
    InspectionResult["NEEDS_ATTENTION"] = "NEEDS_ATTENTION";
})(InspectionResult || (exports.InspectionResult = InspectionResult = {}));
let MonitoringLog = class MonitoringLog {
    isPassed() {
        return this.result === InspectionResult.PASS;
    }
    isFailed() {
        return this.result === InspectionResult.FAIL;
    }
    needsAttention() {
        return this.result === InspectionResult.NEEDS_ATTENTION;
    }
    hasAnomalies() {
        return this.anomalies && this.anomalies.length > 0;
    }
    addAnomaly(anomaly) {
        if (!this.anomalies) {
            this.anomalies = [];
        }
        this.anomalies.push(anomaly);
    }
    addEvidence(url) {
        if (!this.evidence_urls) {
            this.evidence_urls = [];
        }
        this.evidence_urls.push(url);
    }
};
exports.MonitoringLog = MonitoringLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MonitoringLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], MonitoringLog.prototype, "schedule_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => monitoring_schedule_entity_1.MonitoringSchedule, (schedule) => schedule.logs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'schedule_id' }),
    __metadata("design:type", monitoring_schedule_entity_1.MonitoringSchedule)
], MonitoringLog.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MonitoringLog.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.monitoringLogs),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], MonitoringLog.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MonitoringLog.prototype, "inspector_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'inspector_id' }),
    __metadata("design:type", user_entity_1.User)
], MonitoringLog.prototype, "inspector", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], MonitoringLog.prototype, "inspection_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InspectionResult,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MonitoringLog.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], MonitoringLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: [],
    }),
    __metadata("design:type", Array)
], MonitoringLog.prototype, "anomalies", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: [],
    }),
    __metadata("design:type", Array)
], MonitoringLog.prototype, "evidence_urls", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], MonitoringLog.prototype, "created_at", void 0);
exports.MonitoringLog = MonitoringLog = __decorate([
    (0, typeorm_1.Entity)('monitoring_logs')
], MonitoringLog);
//# sourceMappingURL=monitoring-log.entity.js.map