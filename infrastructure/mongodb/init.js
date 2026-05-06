// MongoDB initialization script for Warehouse Intelligence Monitoring System
// This script sets up collections, indexes, and initial data for AI logs and observability

// Switch to warehouse_logs database
db = db.getSiblingDB('warehouse_logs');

// ============================================
// AI LOGS COLLECTION
// ============================================

// Create ai_logs collection with schema validation
db.createCollection('ai_logs', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["alert_id", "model_name", "timestamp"],
      properties: {
        alert_id: {
          bsonType: "string",
          description: "Reference to PostgreSQL ai_alerts.id (UUID)"
        },
        model_name: {
          bsonType: "string",
          enum: ["anomaly_detector", "demand_forecaster", "stock_optimizer", "pattern_analyzer"],
          description: "Name of the ML model"
        },
        model_version: {
          bsonType: "string",
          description: "Version of the model"
        },
        input_features: {
          bsonType: "object",
          description: "Input features used for prediction"
        },
        output_prediction: {
          bsonType: "object",
          description: "Model output/prediction result"
        },
        execution_time_ms: {
          bsonType: "int",
          minimum: 0,
          description: "Model inference time in milliseconds"
        },
        confidence_score: {
          bsonType: "double",
          minimum: 0,
          maximum: 1,
          description: "Model confidence in prediction"
        },
        timestamp: {
          bsonType: "date",
          description: "When the prediction was made"
        }
      }
    }
  }
});

// Create indexes for ai_logs
db.ai_logs.createIndex({ alert_id: 1 });
db.ai_logs.createIndex({ model_name: 1, timestamp: -1 });
db.ai_logs.createIndex({ timestamp: -1 });
db.ai_logs.createIndex({ model_name: 1, model_version: 1 });

// Set TTL for ai_logs (keep for 90 days)
db.ai_logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 7776000 } // 90 days
);

// ============================================
// OBSERVABILITY LOGS COLLECTION
// ============================================

db.createCollection('observability_logs', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["service_name", "level", "message", "timestamp"],
      properties: {
        service_name: {
          bsonType: "string",
          enum: ["backend", "ai-service", "nginx", "scheduler"],
          description: "Name of the service"
        },
        level: {
          bsonType: "string",
          enum: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
          description: "Log level"
        },
        message: {
          bsonType: "string",
          description: "Log message"
        },
        metadata: {
          bsonType: "object",
          description: "Additional metadata"
        },
        correlation_id: {
          bsonType: "string",
          description: "Request correlation ID for tracing"
        },
        user_id: {
          bsonType: "string",
          description: "User ID if applicable"
        },
        ip_address: {
          bsonType: "string",
          description: "Client IP address"
        },
        response_time_ms: {
          bsonType: "int",
          description: "Response time in milliseconds"
        },
        timestamp: {
          bsonType: "date",
          description: "When the log was created"
        }
      }
    }
  }
});

// Create indexes for observability_logs
db.observability_logs.createIndex({ service_name: 1, timestamp: -1 });
db.observability_logs.createIndex({ level: 1, timestamp: -1 });
db.observability_logs.createIndex({ correlation_id: 1 });
db.observability_logs.createIndex({ timestamp: -1 });

// Set TTL for observability_logs (keep for 30 days)
db.observability_logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

// ============================================
// ANALYTICS SNAPSHOTS COLLECTION
// ============================================

db.createCollection('analytics_snapshots', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["snapshot_type", "data", "created_at"],
      properties: {
        snapshot_type: {
          bsonType: "string",
          enum: [
            "daily_stock_summary",
            "weekly_movement_analysis",
            "monthly_demand_forecast",
            "alert_performance",
            "system_health",
            "user_activity"
          ],
          description: "Type of analytics snapshot"
        },
        data: {
          bsonType: "object",
          description: "Snapshot data"
        },
        period_start: {
          bsonType: "date",
          description: "Start of the analysis period"
        },
        period_end: {
          bsonType: "date",
          description: "End of the analysis period"
        },
        created_at: {
          bsonType: "date",
          description: "When the snapshot was created"
        }
      }
    }
  }
});

// Create indexes for analytics_snapshots
db.analytics_snapshots.createIndex({ snapshot_type: 1, created_at: -1 });
db.analytics_snapshots.createIndex({ period_start: 1, period_end: 1 });
db.analytics_snapshots.createIndex({ created_at: -1 });

// ============================================
// MODEL PERFORMANCE METRICS COLLECTION
// ============================================

db.createCollection('model_performance', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["model_name", "metrics", "evaluated_at"],
      properties: {
        model_name: {
          bsonType: "string",
          description: "Name of the ML model"
        },
        model_version: {
          bsonType: "string",
          description: "Version of the model"
        },
        metrics: {
          bsonType: "object",
          properties: {
            accuracy: { bsonType: "double" },
            precision: { bsonType: "double" },
            recall: { bsonType: "double" },
            f1_score: { bsonType: "double" },
            mse: { bsonType: "double" },
            mae: { bsonType: "double" },
            confusion_matrix: { bsonType: "array" }
          },
          description: "Performance metrics"
        },
        evaluation_period: {
          bsonType: "object",
          properties: {
            start: { bsonType: "date" },
            end: { bsonType: "date" }
          },
          description: "Period used for evaluation"
        },
        sample_size: {
          bsonType: "int",
          minimum: 0,
          description: "Number of samples used"
        },
        evaluated_at: {
          bsonType: "date",
          description: "When the evaluation was performed"
        }
      }
    }
  }
});

// Create indexes for model_performance
db.model_performance.createIndex({ model_name: 1, evaluated_at: -1 });
db.model_performance.createIndex({ evaluated_at: -1 });

// ============================================
// ALERT FEEDBACK COLLECTION
// ============================================

// Track human feedback on AI alerts for model improvement
db.createCollection('alert_feedback', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["alert_id", "feedback_type", "user_id", "created_at"],
      properties: {
        alert_id: {
          bsonType: "string",
          description: "Reference to ai_alerts.id"
        },
        feedback_type: {
          bsonType: "string",
          enum: ["USEFUL", "NOT_USEFUL", "INCORRECT", "DUPLICATE", "IRRELEVANT"],
          description: "Type of feedback"
        },
        user_id: {
          bsonType: "string",
          description: "User who provided feedback (UUID)"
        },
        comments: {
          bsonType: "string",
          description: "Additional comments"
        },
        impact_on_decision: {
          bsonType: "string",
          enum: ["APPROVED", "REJECTED", "IGNORED"],
          description: "How feedback influenced decision"
        },
        created_at: {
          bsonType: "date",
          description: "When feedback was given"
        }
      }
    }
  }
});

// Create indexes for alert_feedback
db.alert_feedback.createIndex({ alert_id: 1 });
db.alert_feedback.createIndex({ user_id: 1, created_at: -1 });
db.alert_feedback.createIndex({ created_at: -1 });

// ============================================
// REAL-TIME EVENTS COLLECTION (for WebSocket history)
// ============================================

db.createCollection('realtime_events', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["event_type", "payload", "timestamp"],
      properties: {
        event_type: {
          bsonType: "string",
          enum: [
            "STOCK_MOVEMENT_CREATED",
            "STOCK_MOVEMENT_VALIDATED",
            "AI_ALERT_GENERATED",
            "AI_ALERT_APPROVED",
            "AI_ALERT_REJECTED",
            "MONITORING_COMPLETED",
            "ANOMALY_DETECTED",
            "STOCK_LEVEL_CHANGED"
          ],
          description: "Type of real-time event"
        },
        payload: {
          bsonType: "object",
          description: "Event payload data"
        },
        room: {
          bsonType: "string",
          description: "WebSocket room/channel"
        },
        timestamp: {
          bsonType: "date",
          description: "When the event occurred"
        }
      }
    }
  }
});

// Create indexes for realtime_events
db.realtime_events.createIndex({ event_type: 1, timestamp: -1 });
db.realtime_events.createIndex({ timestamp: -1 });

// Set TTL for realtime_events (keep for 7 days)
db.realtime_events.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 604800 } // 7 days
);

// ============================================
// INSERT SAMPLE DATA
// ============================================

// Insert sample model performance data
db.model_performance.insertMany([
  {
    model_name: "anomaly_detector",
    model_version: "1.0.0",
    metrics: {
      accuracy: 0.92,
      precision: 0.89,
      recall: 0.87,
      f1_score: 0.88
    },
    evaluation_period: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31")
    },
    sample_size: 1000,
    evaluated_at: new Date()
  },
  {
    model_name: "demand_forecaster",
    model_version: "1.0.0",
    metrics: {
      mse: 125.5,
      mae: 8.3
    },
    evaluation_period: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31")
    },
    sample_size: 500,
    evaluated_at: new Date()
  }
]);

print("MongoDB initialization completed successfully!");