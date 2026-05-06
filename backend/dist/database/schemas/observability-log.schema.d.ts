import { Document } from 'mongoose';
export type ObservabilityLogDocument = ObservabilityLog & Document;
export declare class ObservabilityLog {
    service_name: string;
    level: string;
    message: string;
    metadata: Record<string, any>;
    correlation_id: string;
    user_id: string;
    ip_address: string;
    response_time_ms: number;
    timestamp: Date;
}
export declare const ObservabilityLogSchema: import("mongoose").Schema<ObservabilityLog, import("mongoose").Model<ObservabilityLog, any, any, any, Document<unknown, any, ObservabilityLog, any, {}> & ObservabilityLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ObservabilityLog, Document<unknown, {}, import("mongoose").FlatRecord<ObservabilityLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ObservabilityLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
