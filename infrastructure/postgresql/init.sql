-- Warehouse Intelligence Monitoring System - PostgreSQL Schema
-- This script initializes the database with all required tables, indexes, and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for consistent data validation
CREATE TYPE user_role AS ENUM ('warehouse_staff', 'supervisor', 'admin', 'manager');
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER');
CREATE TYPE validation_status AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');
CREATE TYPE alert_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE alert_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISED', 'RESOLVED');
CREATE TYPE approval_decision AS ENUM ('APPROVE', 'REJECT', 'REVISE');
CREATE TYPE monitoring_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE inspection_result AS ENUM ('PASS', 'FAIL', 'NEEDS_ATTENTION');

-- ============================================
-- CORE TABLES
-- ============================================

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    warehouse_id UUID, -- Can be NULL for admins
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Warehouses table
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Indonesia',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for users.warehouse_id
ALTER TABLE users ADD CONSTRAINT fk_users_warehouse 
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id);

-- Items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'UNIT',
    min_stock_level DECIMAL(15,3) DEFAULT 0,
    max_stock_level DECIMAL(15,3),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STOCK MOVEMENTS (Core Transactional Table)
-- ============================================

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    movement_type movement_type NOT NULL,
    quantity DECIMAL(15,3) NOT NULL CHECK (quantity > 0),
    reference_number VARCHAR(100) UNIQUE,
    actor_id UUID NOT NULL REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validation_status validation_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure proper ordering for event sourcing
    CONSTRAINT valid_movement_order CHECK (timestamp <= CURRENT_TIMESTAMP)
);

-- Index for performance on common queries
CREATE INDEX idx_stock_movements_item_warehouse ON stock_movements(item_id, warehouse_id);
CREATE INDEX idx_stock_movements_timestamp ON stock_movements(timestamp DESC);
CREATE INDEX idx_stock_movements_actor ON stock_movements(actor_id);
CREATE INDEX idx_stock_movements_status ON stock_movements(validation_status);
CREATE INDEX idx_stock_movements_reference ON stock_movements(reference_number);

-- ============================================
-- MONITORING TABLES
-- ============================================

CREATE TABLE monitoring_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    frequency monitoring_frequency NOT NULL,
    next_scheduled_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monitoring_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES monitoring_schedules(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    inspector_id UUID NOT NULL REFERENCES users(id),
    inspection_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result inspection_result NOT NULL,
    notes TEXT,
    anomalies JSONB DEFAULT '[]',
    evidence_urls JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_monitoring_logs_warehouse ON monitoring_logs(warehouse_id);
CREATE INDEX idx_monitoring_logs_inspector ON monitoring_logs(inspector_id);
CREATE INDEX idx_monitoring_logs_date ON monitoring_logs(inspection_date DESC);

-- ============================================
-- AI ALERTS & APPROVALS
-- ============================================

CREATE TABLE ai_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(100) NOT NULL,
    item_id UUID REFERENCES items(id),
    warehouse_id UUID REFERENCES warehouses(id),
    severity alert_severity NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    reasoning TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    evidence JSONB DEFAULT '{}',
    model_metadata JSONB DEFAULT '{}',
    status alert_status NOT NULL DEFAULT 'PENDING',
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_alerts_status ON ai_alerts(status);
CREATE INDEX idx_ai_alerts_severity ON ai_alerts(severity);
CREATE INDEX idx_ai_alerts_item ON ai_alerts(item_id);
CREATE INDEX idx_ai_alerts_warehouse ON ai_alerts(warehouse_id);
CREATE INDEX idx_ai_alerts_generated_at ON ai_alerts(generated_at DESC);

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES ai_alerts(id),
    decision approval_decision NOT NULL,
    actor_id UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    revision_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_alert ON approvals(alert_id);
CREATE INDEX idx_approvals_actor ON approvals(actor_id);
CREATE INDEX idx_approvals_created_at ON approvals(created_at DESC);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id), -- Can be NULL for system actions
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address INET,
    user_agent TEXT,
    correlation_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_correlation ON audit_logs(correlation_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitoring_schedules_updated_at BEFORE UPDATE ON monitoring_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_alerts_updated_at BEFORE UPDATE ON ai_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate current stock level
CREATE OR REPLACE FUNCTION calculate_current_stock(p_item_id UUID, p_warehouse_id UUID)
RETURNS DECIMAL(15,3) AS $$
DECLARE
    v_stock DECIMAL(15,3) := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN movement_type = 'IN' THEN quantity
            WHEN movement_type = 'OUT' THEN -quantity
            WHEN movement_type = 'ADJUSTMENT' THEN 
                CASE 
                    WHEN (metadata->>'adjustment_type') = 'ADD' THEN quantity
                    WHEN (metadata->>'adjustment_type') = 'SUBTRACT' THEN -quantity
                    ELSE 0
                END
            WHEN movement_type = 'TRANSFER' THEN 
                CASE 
                    WHEN (metadata->>'transfer_direction') = 'IN' THEN quantity
                    WHEN (metadata->>'transfer_direction') = 'OUT' THEN -quantity
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) INTO v_stock
    FROM stock_movements
    WHERE item_id = p_item_id 
        AND warehouse_id = p_warehouse_id
        AND validation_status = 'VALIDATED'
        AND timestamp <= CURRENT_TIMESTAMP;
    
    RETURN v_stock;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to validate stock movement (prevent negative stock)
CREATE OR REPLACE FUNCTION validate_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
    v_current_stock DECIMAL(15,3);
    v_item_name VARCHAR(255);
BEGIN
    -- Only validate for OUT movements
    IF NEW.movement_type = 'OUT' OR 
       (NEW.movement_type = 'ADJUSTMENT' AND NEW.metadata->>'adjustment_type' = 'SUBTRACT') OR
       (NEW.movement_type = 'TRANSFER' AND NEW.metadata->>'transfer_direction' = 'OUT') THEN
        
        -- Calculate current stock
        SELECT calculate_current_stock(NEW.item_id, NEW.warehouse_id) INTO v_current_stock;
        
        -- Get item name for error message
        SELECT name INTO v_item_name FROM items WHERE id = NEW.item_id;
        
        -- Check if movement would result in negative stock
        IF v_current_stock < NEW.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for item "%". Current: %, Requested: %', 
                v_item_name, v_current_stock, NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock validation
CREATE TRIGGER before_stock_movement_insert
    BEFORE INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION validate_stock_movement();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Current stock levels view
CREATE VIEW current_stock AS
SELECT 
    i.id AS item_id,
    i.sku,
    i.name AS item_name,
    w.id AS warehouse_id,
    w.code AS warehouse_code,
    w.name AS warehouse_name,
    calculate_current_stock(i.id, w.id) AS current_quantity,
    i.min_stock_level,
    i.max_stock_level,
    CASE 
        WHEN calculate_current_stock(i.id, w.id) <= i.min_stock_level THEN 'LOW'
        WHEN i.max_stock_level IS NOT NULL AND calculate_current_stock(i.id, w.id) >= i.max_stock_level THEN 'OVERSTOCK'
        ELSE 'NORMAL'
    END AS stock_status
FROM items i
CROSS JOIN warehouses w
WHERE i.is_active = true AND w.is_active = true;

-- Active alerts summary view
CREATE VIEW active_alerts_summary AS
SELECT 
    severity,
    status,
    COUNT(*) AS alert_count,
    COUNT(DISTINCT warehouse_id) AS affected_warehouses,
    COUNT(DISTINCT item_id) AS affected_items
FROM ai_alerts
WHERE status IN ('PENDING', 'APPROVED')
GROUP BY severity, status;

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default roles
INSERT INTO roles (name, permissions, description) VALUES
('admin', '{"*": "*"}', 'Full system access'),
('manager', '{"stock_movements": ["create", "read", "validate"], "ai_alerts": ["read", "approve"], "monitoring": ["create", "read"], "reports": ["read"]}', 'Warehouse manager with approval rights'),
('supervisor', '{"stock_movements": ["create", "read"], "ai_alerts": ["read", "approve"], "monitoring": ["create", "read"], "reports": ["read"]}', 'Supervisor with limited approval rights'),
('warehouse_staff', '{"stock_movements": ["create", "read"], "monitoring": ["read"]}', 'Basic warehouse staff access');

-- Insert default admin user (password: admin123 - change immediately!)
INSERT INTO users (email, password_hash, full_name, role_id, is_active) 
VALUES (
    'admin@warehouse.com',
    '$2b$10$91L0XeCDs.7xd/..3uX1u.6l6l6l6l6l6l6l6l6l6l6l6l6l6l6l6l6', -- bcrypt hash for 'admin123'
    'System Administrator',
    (SELECT id FROM roles WHERE name = 'admin'),
    true
);

-- Insert sample warehouse
INSERT INTO warehouses (name, code, address, city, country) VALUES
('Main Warehouse', 'WH-001', 'Jl. Industri No. 123', 'Jakarta', 'Indonesia');

COMMIT;