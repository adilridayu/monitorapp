import { Item } from '../../items/entities/item.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { Approval } from '../../approvals/entities/approval.entity';
export declare enum AlertSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum AlertStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REVISED = "REVISED",
    RESOLVED = "RESOLVED"
}
export declare class AiAlert {
    id: string;
    alert_type: string;
    item_id: string;
    item: Item;
    warehouse_id: string;
    warehouse: Warehouse;
    severity: AlertSeverity;
    confidence_score: number;
    reasoning: string;
    recommendation: string;
    evidence: Record<string, any>;
    model_metadata: Record<string, any>;
    status: AlertStatus;
    generated_at: Date;
    reviewed_by: string;
    reviewedBy: User;
    reviewed_at: Date;
    approvals: Approval[];
    created_at: Date;
    updated_at: Date;
    isPending(): boolean;
    isApproved(): boolean;
    isRejected(): boolean;
    isResolved(): boolean;
    requiresReview(): boolean;
    approve(userId: string): void;
    reject(userId: string): void;
    resolve(): void;
    getSeverityLevel(): number;
}
