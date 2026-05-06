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
exports.ObservabilityLogSchema = exports.ObservabilityLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ObservabilityLog = class ObservabilityLog {
};
exports.ObservabilityLog = ObservabilityLog;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['backend', 'ai-service', 'nginx', 'scheduler'],
        index: true,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "service_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
        index: true,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        required: false,
    }),
    __metadata("design:type", Object)
], ObservabilityLog.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
        index: true,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "correlation_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], ObservabilityLog.prototype, "ip_address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        min: 0,
        required: false,
    }),
    __metadata("design:type", Number)
], ObservabilityLog.prototype, "response_time_ms", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
        index: true,
        expires: 2592000,
    }),
    __metadata("design:type", Date)
], ObservabilityLog.prototype, "timestamp", void 0);
exports.ObservabilityLog = ObservabilityLog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'observability_logs',
    })
], ObservabilityLog);
exports.ObservabilityLogSchema = mongoose_1.SchemaFactory.createForClass(ObservabilityLog);
exports.ObservabilityLogSchema.index({ service_name: 1, timestamp: -1 });
exports.ObservabilityLogSchema.index({ level: 1, timestamp: -1 });
//# sourceMappingURL=observability-log.schema.js.map