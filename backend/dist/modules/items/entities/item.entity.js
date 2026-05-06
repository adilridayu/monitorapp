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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
const stock_movement_entity_1 = require("../../stock-movements/entities/stock-movement.entity");
const ai_alert_entity_1 = require("../../ai-alerts/entities/ai-alert.entity");
let Item = class Item {
    isLowStock(currentQuantity) {
        return currentQuantity <= this.min_stock_level;
    }
    isOverstock(currentQuantity) {
        return this.max_stock_level !== null && currentQuantity >= this.max_stock_level;
    }
    getStockStatus(currentQuantity) {
        if (this.isLowStock(currentQuantity))
            return 'LOW';
        if (this.isOverstock(currentQuantity))
            return 'OVERSTOCK';
        return 'NORMAL';
    }
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        unique: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Item.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
    }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Item.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'UNIT',
    }),
    __metadata("design:type", String)
], Item.prototype, "unit_of_measure", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 3,
        default: 0,
    }),
    __metadata("design:type", Number)
], Item.prototype, "min_stock_level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 3,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Item.prototype, "max_stock_level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Item.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_movement_entity_1.StockMovement, (movement) => movement.item),
    __metadata("design:type", Array)
], Item.prototype, "stockMovements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ai_alert_entity_1.AiAlert, (alert) => alert.item),
    __metadata("design:type", Array)
], Item.prototype, "aiAlerts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Item.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Item.prototype, "updated_at", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)('items')
], Item);
//# sourceMappingURL=item.entity.js.map