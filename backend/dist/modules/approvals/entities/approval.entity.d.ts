import { AiAlert } from '../../ai-alerts/entities/ai-alert.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ApprovalDecision {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    REVISE = "REVISE"
}
export declare class Approval {
    id: string;
    alert_id: string;
    alert: AiAlert;
    decision: ApprovalDecision;
    actor_id: string;
    actor: User;
    notes: string;
    revision_comments: string;
    created_at: Date;
    isApproved(): boolean;
    isRejected(): boolean;
    isRevised(): boolean;
}
