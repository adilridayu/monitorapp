import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    actor_id: string;
    actor: User;
    action: string;
    entity_type: string;
    entity_id: string;
    before_state: Record<string, any>;
    after_state: Record<string, any>;
    ip_address: string;
    user_agent: string;
    correlation_id: string;
    created_at: Date;
    static createAction(actorId: string, entityType: string, entityId: string, beforeState?: any, afterState?: any, ipAddress?: string, userAgent?: string, correlationId?: string): Partial<AuditLog>;
    static updateAction(actorId: string, entityType: string, entityId: string, beforeState: any, afterState: any, ipAddress?: string, userAgent?: string, correlationId?: string): Partial<AuditLog>;
    static deleteAction(actorId: string, entityType: string, entityId: string, beforeState: any, ipAddress?: string, userAgent?: string, correlationId?: string): Partial<AuditLog>;
}
