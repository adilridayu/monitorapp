/**
 * AI Log MongoDB Schema
 * Stores AI model execution logs and predictions
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiLogDocument = AiLog & Document;

@Schema({
  timestamps: true,
  collection: 'ai_logs',
})
export class AiLog {
  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  alert_id: string;

  @Prop({
    type: String,
    required: true,
    enum: ['anomaly_detector', 'demand_forecaster', 'stock_optimizer', 'pattern_analyzer'],
    index: true,
  })
  model_name: string;

  @Prop({
    type: String,
    required: false,
  })
  model_version: string;

  @Prop({
    type: Object,
    required: false,
  })
  input_features: Record<string, any>;

  @Prop({
    type: Object,
    required: false,
  })
  output_prediction: Record<string, any>;

  @Prop({
    type: Number,
    min: 0,
    required: false,
  })
  execution_time_ms: number;

  @Prop({
    type: Number,
    min: 0,
    max: 1,
    required: false,
  })
  confidence_score: number;

  @Prop({
    type: Date,
    default: Date.now,
    index: true,
    expires: 7776000, // 90 days TTL
  })
  timestamp: Date;
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog);

// Compound index for efficient queries
AiLogSchema.index({ model_name: 1, timestamp: -1 });