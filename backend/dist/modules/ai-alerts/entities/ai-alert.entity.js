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
exports.AiAlert = exports.AlertStatus = exports.AlertSeverity = void 0;
const typeorm_1 = require("typeorm");
const item_entity_1 = require("../../items/entities/item.entity");
const warehouse_entity_1 = require("../../warehouses/entities/warehouse.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const approval_entity_1 = require("../../approvals/entities/approval.entity");
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["PENDING"] = "PENDING";
    AlertStatus["APPROVED"] = "APPROVED";
    AlertStatus["REJECTED"] = "REJECTED";
    AlertStatus["REVISED"] = "REVISED";
    AlertStatus["RESOLVED"] = "RESOLVED";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
let AiAlert = class AiAlert {
    isPending() {
        return this.status === AlertStatus.PENDING;
    }
    isApproved() {
        return this.status === AlertStatus.APPROVED;
    }
    isRejected() {
        return this.status === AlertStatus.REJECTED;
    }
    isResolved() {
        return this.status === AlertStatus.RESOLVED;
    }
    requiresReview() {
        return this.status === AlertStatus.PENDING;
    }
    approve(userId) {
        this.status = AlertStatus.APPROVED;
        this.reviewed_by = userId;
        this.reviewed_at = new Date();
    }
    reject(userId) {
        this.status = AlertStatus.REJECTED;
        this.reviewed_by = userId;
        this.reviewed_at = new Date();
    }
    resolve() {
        this.status = AlertStatus.RESOLVED;
    }
    getSeverityLevel() {
        switch (this.severity) {
            case AlertSeverity.CRITICAL: return 4;
            case AlertSeverity.HIGH: return 3;
            case AlertSeverity.MEDIUM: return 2;
            case AlertSeverity.LOW: return 1;
            default: return 0;
        }
    }
};
exports.AiAlert = AiAlert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AiAlert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AiAlert.prototype, "alert_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AiAlert.prototype, "item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, (item) => item.aiAlerts, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'item_id' }),
    __metadata("design:type", item_entity_1.Item)
], AiAlert.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AiAlert.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.aiAlerts, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], AiAlert.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AlertSeverity,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AiAlert.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 3,
        scale: 2,
    }),
    __metadata("design:type", Number)
], AiAlert.prototype, "confidence_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], AiAlert.prototype, "reasoning", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], AiAlert.prototype, "recommendation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: {},
    }),
    __metadata("design:type", Object)
], AiAlert.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: {},
    }),
    __metadata("design:type", Object)
], AiAlert.prototype, "model_metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AlertStatus,
        default: AlertStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AiAlert.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], AiAlert.prototype, "generated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AiAlert.prototype, "reviewed_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reviewedAlerts, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewed_by' }),
    __metadata("design:type", user_entity_1.User)
], AiAlert.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AiAlert.prototype, "reviewed_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_entity_1.Approval, (approval) => approval.alert),
    __metadata("design:type", Array)
], AiAlert.prototype, "approvals", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AiAlert.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AiAlert.prototype, "updated_at", void 0);
exports.AiAlert = AiAlert = __decorate([
    (0, typeorm_1.Entity)('ai_alerts')
], AiAlert);
//# sourceMappingURL=ai-alert.entity.js.map