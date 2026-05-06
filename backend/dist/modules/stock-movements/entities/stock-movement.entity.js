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
exports.StockMovement = exports.ValidationStatus = exports.MovementType = void 0;
const typeorm_1 = require("typeorm");
const item_entity_1 = require("../../items/entities/item.entity");
const warehouse_entity_1 = require("../../warehouses/entities/warehouse.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var MovementType;
(function (MovementType) {
    MovementType["IN"] = "IN";
    MovementType["OUT"] = "OUT";
    MovementType["ADJUSTMENT"] = "ADJUSTMENT";
    MovementType["TRANSFER"] = "TRANSFER";
})(MovementType || (exports.MovementType = MovementType = {}));
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["PENDING"] = "PENDING";
    ValidationStatus["VALIDATED"] = "VALIDATED";
    ValidationStatus["REJECTED"] = "REJECTED";
})(ValidationStatus || (exports.ValidationStatus = ValidationStatus = {}));
let StockMovement = class StockMovement {
    isPending() {
        return this.validation_status === ValidationStatus.PENDING;
    }
    isValidated() {
        return this.validation_status === ValidationStatus.VALIDATED;
    }
    isRejected() {
        return this.validation_status === ValidationStatus.REJECTED;
    }
    isIncoming() {
        return this.movement_type === MovementType.IN ||
            (this.movement_type === MovementType.ADJUSTMENT && this.metadata?.adjustment_type === 'ADD') ||
            (this.movement_type === MovementType.TRANSFER && this.metadata?.transfer_direction === 'IN');
    }
    isOutgoing() {
        return this.movement_type === MovementType.OUT ||
            (this.movement_type === MovementType.ADJUSTMENT && this.metadata?.adjustment_type === 'SUBTRACT') ||
            (this.movement_type === MovementType.TRANSFER && this.metadata?.transfer_direction === 'OUT');
    }
    validate() {
        this.validation_status = ValidationStatus.VALIDATED;
    }
    reject() {
        this.validation_status = ValidationStatus.REJECTED;
    }
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, (item) => item.stockMovements, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'item_id' }),
    __metadata("design:type", item_entity_1.Item)
], StockMovement.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, (warehouse) => warehouse.stockMovements, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], StockMovement.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MovementType,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StockMovement.prototype, "movement_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 3,
    }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StockMovement.prototype, "reference_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'uuid',
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "actor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.stockMovements),
    (0, typeorm_1.JoinColumn)({ name: 'actor_id' }),
    __metadata("design:type", user_entity_1.User)
], StockMovement.prototype, "actor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], StockMovement.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ValidationStatus,
        default: ValidationStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], StockMovement.prototype, "validation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: {},
    }),
    __metadata("design:type", Object)
], StockMovement.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], StockMovement.prototype, "created_at", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)('stock_movements'),
    (0, typeorm_1.Check)(`"quantity" > 0`)
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map