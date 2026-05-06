import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';
export declare class Item {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    unit_of_measure: string;
    min_stock_level: number;
    max_stock_level: number;
    is_active: boolean;
    stockMovements: StockMovement[];
    aiAlerts: AiAlert[];
    created_at: Date;
    updated_at: Date;
    isLowStock(currentQuantity: number): boolean;
    isOverstock(currentQuantity: number): boolean;
    getStockStatus(currentQuantity: number): 'LOW' | 'NORMAL' | 'OVERSTOCK';
}
