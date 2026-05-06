import { User } from '../../users/entities/user.entity';
export declare enum UserRole {
    WAREHOUSE_STAFF = "warehouse_staff",
    SUPERVISOR = "supervisor",
    ADMIN = "admin",
    MANAGER = "manager"
}
export declare class Role {
    id: string;
    name: UserRole;
    permissions: Record<string, string[]>;
    description: string;
    users: User[];
    created_at: Date;
    updated_at: Date;
}
