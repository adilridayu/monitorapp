/**
 * Observability Log MongoDB Schema
 * Stores system observability logs for monitoring and debugging
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObservabilityLogDocument = ObservabilityLog & Document;

@Schema({
  timestamps: true,
  collection: 'observability_logs',
})
export class ObservabilityLog {
  @Prop({
    type: String,
    required: true,
    enum: ['backend', 'ai-service', 'nginx', 'scheduler'],
    index: true,
  })
  service_name: string;

  @Prop({
    type: String,
    required: true,
    enum: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
    index: true,
  })
  level: string;

  @Prop({
    type: String,
    required: true,
  })
  message: string;

  @Prop({
    type: Object,
    required: false,
  })
  metadata: Record<string, any>;

  @Prop({
    type: String,
    required: false,
    index: true,
  })
  correlation_id: string;

  @Prop({
    type: String,
    required: false,
  })
  user_id: string;

  @Prop({
    type: String,
    required: false,
  })
  ip_address: string;

  @Prop({
    type: Number,
    min: 0,
    required: false,
  })
  response_time_ms: number;

  @Prop({
    type: Date,
    default: Date.now,
    index: true,
    expires: 2592000, // 30 days TTL
  })
  timestamp: Date;
}

export const ObservabilityLogSchema = SchemaFactory.createForClass(ObservabilityLog);

// Compound indexes for efficient queries
ObservabilityLogSchema.index({ service_name: 1, timestamp: -1 });
ObservabilityLogSchema.index({ level: 1, timestamp: -1 });