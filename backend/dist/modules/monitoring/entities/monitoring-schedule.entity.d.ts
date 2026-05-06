import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { MonitoringLog } from './monitoring-log.entity';
export declare enum MonitoringFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY"
}
export declare class MonitoringSchedule {
    id: string;
    warehouse_id: string;
    warehouse: Warehouse;
    frequency: MonitoringFrequency;
    next_scheduled_date: Date;
    is_active: boolean;
    created_by: string;
    creator: User;
    logs: MonitoringLog[];
    created_at: Date;
    updated_at: Date;
    isDue(): boolean;
    isActive(): boolean;
    deactivate(): void;
    activate(): void;
    getNextScheduleDate(): Date;
    updateNextSchedule(): void;
}
