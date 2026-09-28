-- UPIShield Supabase PostgreSQL Schema Migration
-- Migration: 20260928000000_init_schema.sql

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id VARCHAR PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR NOT NULL,
    bank TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    cctv_available INTEGER NOT NULL DEFAULT 0,
    historical_fraud_count INTEGER NOT NULL DEFAULT 0
);

-- 2. Cases Table
CREATE TABLE IF NOT EXISTS public.cases (
    id VARCHAR PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    total_amount_lost DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL,
    primary_mule_account TEXT,
    primary_mule_upi TEXT
);

-- 3. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id VARCHAR PRIMARY KEY,
    case_id VARCHAR NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    victim_name TEXT NOT NULL,
    victim_phone TEXT NOT NULL,
    victim_upi TEXT NOT NULL,
    victim_account TEXT NOT NULL,
    victim_bank TEXT NOT NULL,
    fraud_category TEXT NOT NULL,
    reported_amount DOUBLE PRECISION NOT NULL,
    incident_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reported_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR NOT NULL,
    city VARCHAR NOT NULL
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id VARCHAR PRIMARY KEY,
    case_id VARCHAR NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_type VARCHAR NOT NULL,
    receiver_id TEXT NOT NULL,
    receiver_type VARCHAR NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id TEXT,
    ip_address TEXT,
    location TEXT,
    layer_index INTEGER NOT NULL
);

-- 5. Historical Cashouts Table
CREATE TABLE IF NOT EXISTS public.historical_cashouts (
    id VARCHAR PRIMARY KEY,
    location_id VARCHAR NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    withdrawal_time TIMESTAMP WITH TIME ZONE NOT NULL,
    distance_from_last_hop_km DOUBLE PRECISION NOT NULL,
    mule_account_id TEXT NOT NULL,
    successful INTEGER NOT NULL DEFAULT 1
);

-- 6. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id VARCHAR PRIMARY KEY,
    case_id VARCHAR NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    case_title TEXT NOT NULL,
    priority VARCHAR NOT NULL,
    target_agencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    predicted_locations JSONB NOT NULL DEFAULT '[]'::jsonb,
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL,
    action_code VARCHAR NOT NULL,
    summary TEXT NOT NULL
);

-- Indexes for performant query execution
CREATE INDEX IF NOT EXISTS idx_complaints_case_id ON public.complaints(case_id);
CREATE INDEX IF NOT EXISTS idx_transactions_case_id ON public.transactions(case_id);
CREATE INDEX IF NOT EXISTS idx_transactions_layer ON public.transactions(layer_index);
CREATE INDEX IF NOT EXISTS idx_cashouts_location_id ON public.historical_cashouts(location_id);
CREATE INDEX IF NOT EXISTS idx_alerts_case_id ON public.alerts(case_id);
CREATE INDEX IF NOT EXISTS idx_alerts_dispatched_at ON public.alerts(dispatched_at DESC);
