-- ARGUS AI Sales Closer - Database Schema Migration
-- Designed for PostgreSQL / Supabase Multi-Tenant Architecture

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    fub_api_key VARCHAR(255) DEFAULT '',
    twilio_sid VARCHAR(255) DEFAULT '',
    twilio_auth_token VARCHAR(255) DEFAULT '',
    twilio_phone_number VARCHAR(50) DEFAULT '',
    isa_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Qualification Stage ENUM (Optional or String constraint)
CREATE TYPE qualification_stage_type AS ENUM (
    'New',
    'Engaged',
    'Qualified',
    'Unrepresented_Disqualified'
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    fub_person_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    qualification_stage qualification_stage_type DEFAULT 'New',
    timeline VARCHAR(100) DEFAULT 'Unknown',
    budget VARCHAR(100) DEFAULT 'Unknown',
    pre_approved BOOLEAN DEFAULT FALSE,
    representation_status VARCHAR(100) DEFAULT 'Needs_Verification',
    search_criteria TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_contact_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')),
    body TEXT NOT NULL,
    ai_reasoning TEXT DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('LEAD_QUALIFIED', 'URGENT_INTENT', 'HUMAN_HANDOFF')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Speed & Multi-Tenant Querying
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_fub_person_id ON leads(fub_person_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);

-- Row Level Security (RLS) & Multi-Tenant Isolation
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Multi-tenant isolation policies based on current_setting('app.current_tenant_id')
CREATE POLICY tenant_isolation_policy_tenants ON tenants FOR ALL USING (id = current_setting('app.current_tenant_id', true));
CREATE POLICY tenant_isolation_policy_leads ON leads FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true));
CREATE POLICY tenant_isolation_policy_messages ON messages FOR ALL USING (
    lead_id IN (SELECT id FROM leads WHERE tenant_id = current_setting('app.current_tenant_id', true))
);
CREATE POLICY tenant_isolation_policy_notifications ON notifications FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Sample Initial Tenant Seed
INSERT INTO tenants (id, team_name, fub_api_key, twilio_sid, twilio_phone_number, created_at)
VALUES 
    ('tenant_yorkville_01', 'Yorkville Luxury Group', 'fk_live_toronto_9981', 'AC_twilio_yorkville_883', '+14165550199', NOW()),
    ('tenant_king_west_02', 'King West Realty Collective', 'fk_live_toronto_4412', 'AC_twilio_kingwest_312', '+14165550188', NOW())
ON CONFLICT (id) DO NOTHING;
