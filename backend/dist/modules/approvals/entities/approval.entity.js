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
exports.Approval = exports.ApprovalDecision = void 0;
const typeorm_1 = require("typeorm");
const ai_alert_entity_1 = require("../../ai-alerts/entities/ai-alert.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["APPROVE"] = "APPROVE";
    ApprovalDecision["REJECT"] = "REJECT";
    ApprovalDecision["REVISE"] = "REVISE";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
let Approval = class Approval {
    isApproved() {
        return this.decision === ApprovalDecision.APPROVE;
    }
    isRejected() {
        return this.decision === ApprovalDecision.REJECT;
    }
    isRevised() {
        return this.decision === ApprovalDecision.REVISE;
    }
};
exports.Approval = Approval;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Approval.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Approval.prototype, "alert_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ai_alert_entity_1.AiAlert, (alert) => alert.approvals),
    (0, typeorm_1.JoinColumn)({ name: 'alert_id' }),
    __metadata("design:type", ai_alert_entity_1.AiAlert)
], Approval.prototype, "alert", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApprovalDecision,
    }),
    __metadata("design:type", String)
], Approval.prototype, "decision", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Approval.prototype, "actor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.approvals),
    (0, typeorm_1.JoinColumn)({ name: 'actor_id' }),
    __metadata("design:type", user_entity_1.User)
], Approval.prototype, "actor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Approval.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Approval.prototype, "revision_comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Approval.prototype, "created_at", void 0);
exports.Approval = Approval = __decorate([
    (0, typeorm_1.Entity)('approvals')
], Approval);
//# sourceMappingURL=approval.entity.js.map