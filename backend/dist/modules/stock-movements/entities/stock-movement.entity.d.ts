import { Item } from '../../items/entities/item.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
export declare enum MovementType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER"
}
export declare enum ValidationStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED"
}
export declare class StockMovement {
    id: string;
    item_id: string;
    item: Item;
    warehouse_id: string;
    warehouse: Warehouse;
    movement_type: MovementType;
    quantity: number;
    reference_number: string;
    actor_id: string;
    actor: User;
    timestamp: Date;
    validation_status: ValidationStatus;
    notes: string;
    metadata: Record<string, any>;
    created_at: Date;
    isPending(): boolean;
    isValidated(): boolean;
    isRejected(): boolean;
    isIncoming(): boolean;
    isOutgoing(): boolean;
    validate(): void;
    reject(): void;
}
