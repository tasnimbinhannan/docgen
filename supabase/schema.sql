-- ==============================================================================
-- DOCUMENT GENERATION WEB APPLICATION - SUPABASE POSTGRESQL SCHEMA
-- Specification Reference: SRS-DGA-001 (Version 0.1)
-- ==============================================================================

-- 1. Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_reference TEXT NOT NULL UNIQUE,
    public_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    doc_type TEXT NOT NULL,                         -- 'event_ticket', 'certificate', 'receipt_invoice'
    title TEXT NOT NULL,                            -- Human-readable document title
    recipient_name TEXT,                            -- Extracted for fast indexing and search
    submitted_values JSONB NOT NULL DEFAULT '{}'::jsonb, -- Full structured field payload
    generated_by TEXT NOT NULL DEFAULT 'admin',     -- Admin email or auth user id
    status TEXT NOT NULL DEFAULT 'active',          -- 'active', 'revoked', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_documents_public_token ON public.documents (public_token);
CREATE INDEX IF NOT EXISTS idx_documents_doc_reference ON public.documents (doc_reference);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_doc_type ON public.documents (doc_type);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Public Anonymous Access (FR-3.1 & FR-3.5)
-- Anyone holding a valid public_token can SELECT that document (if active)
DROP POLICY IF EXISTS "Public read by token" ON public.documents;
CREATE POLICY "Public read by token"
    ON public.documents
    FOR SELECT
    TO anon
    USING (status = 'active');

-- 5. RLS Policy: Authenticated Admin Full Access (FR-4.1, FR-1.5, FR-2.1)
-- Authenticated admins can view, generate, search, and manage all documents
DROP POLICY IF EXISTS "Admin full access" ON public.documents;
CREATE POLICY "Admin full access"
    ON public.documents
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. (Optional) Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_documents_updated_at ON public.documents;
CREATE TRIGGER set_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SEED / SAMPLE DATA (Optional - for initial testing)
-- ==============================================================================
/*
INSERT INTO public.documents (doc_reference, doc_type, title, recipient_name, submitted_values, generated_by)
VALUES (
    'TCK-2026-X9A21',
    'event_ticket',
    'Global Tech Summit 2026',
    'Alex Morgan',
    '{"eventName": "Global Tech Summit 2026", "attendeeName": "Alex Morgan", "tier": "VIP All-Access", "date": "2026-10-15", "time": "09:00 AM", "venue": "Metropolis Convention Center, Hall A", "gate": "Gate 3", "seat": "VIP-A12", "organizer": "Tech Innovations Network"}'::jsonb,
    'admin@example.com'
);
*/
