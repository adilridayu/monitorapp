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
exports.AiLogSchema = exports.AiLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AiLog = class AiLog {
};
exports.AiLog = AiLog;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], AiLog.prototype, "alert_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['anomaly_detector', 'demand_forecaster', 'stock_optimizer', 'pattern_analyzer'],
        index: true,
    }),
    __metadata("design:type", String)
], AiLog.prototype, "model_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
    }),
    __metadata("design:type", String)
], AiLog.prototype, "model_version", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        required: false,
    }),
    __metadata("design:type", Object)
], AiLog.prototype, "input_features", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        required: false,
    }),
    __metadata("design:type", Object)
], AiLog.prototype, "output_prediction", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        min: 0,
        required: false,
    }),
    __metadata("design:type", Number)
], AiLog.prototype, "execution_time_ms", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        min: 0,
        max: 1,
        required: false,
    }),
    __metadata("design:type", Number)
], AiLog.prototype, "confidence_score", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
        index: true,
        expires: 7776000,
    }),
    __metadata("design:type", Date)
], AiLog.prototype, "timestamp", void 0);
exports.AiLog = AiLog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ai_logs',
    })
], AiLog);
exports.AiLogSchema = mongoose_1.SchemaFactory.createForClass(AiLog);
exports.AiLogSchema.index({ model_name: 1, timestamp: -1 });
//# sourceMappingURL=ai-log.schema.js.map