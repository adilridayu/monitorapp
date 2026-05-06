import { User } from '../../users/entities/user.entity';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { MonitoringSchedule } from '../../monitoring/entities/monitoring-schedule.entity';
import { MonitoringLog } from '../../monitoring/entities/monitoring-log.entity';
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';
export declare class Warehouse {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    country: string;
    is_active: boolean;
    users: User[];
    stockMovements: StockMovement[];
    monitoringSchedules: MonitoringSchedule[];
    monitoringLogs: MonitoringLog[];
    aiAlerts: AiAlert[];
    created_at: Date;
    updated_at: Date;
    get fullAddress(): string;
}
