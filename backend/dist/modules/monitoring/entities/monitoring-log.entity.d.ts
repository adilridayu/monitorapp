import { MonitoringSchedule } from './monitoring-schedule.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
export declare enum InspectionResult {
    PASS = "PASS",
    FAIL = "FAIL",
    NEEDS_ATTENTION = "NEEDS_ATTENTION"
}
export declare class MonitoringLog {
    id: string;
    schedule_id: string;
    schedule: MonitoringSchedule;
    warehouse_id: string;
    warehouse: Warehouse;
    inspector_id: string;
    inspector: User;
    inspection_date: Date;
    result: InspectionResult;
    notes: string;
    anomalies: Array<{
        type: string;
        description: string;
        severity: string;
        location?: string;
    }>;
    evidence_urls: string[];
    created_at: Date;
    isPassed(): boolean;
    isFailed(): boolean;
    needsAttention(): boolean;
    hasAnomalies(): boolean;
    addAnomaly(anomaly: {
        type: string;
        description: string;
        severity: string;
        location?: string;
    }): void;
    addEvidence(url: string): void;
}
