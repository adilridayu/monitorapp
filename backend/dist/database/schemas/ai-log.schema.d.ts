import { Document, Types } from 'mongoose';
export type AiLogDocument = AiLog & Document;
export declare class AiLog {
    alert_id: string;
    model_name: string;
    model_version: string;
    input_features: Record<string, any>;
    output_prediction: Record<string, any>;
    execution_time_ms: number;
    confidence_score: number;
    timestamp: Date;
}
export declare const AiLogSchema: import("mongoose").Schema<AiLog, import("mongoose").Model<AiLog, any, any, any, Document<unknown, any, AiLog, any, {}> & AiLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AiLog, Document<unknown, {}, import("mongoose").FlatRecord<AiLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AiLog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
