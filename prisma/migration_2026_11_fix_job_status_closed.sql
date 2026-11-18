-- Run once on an existing database created from an older supabase_schema.sql.
-- Adds the 'closed' job status used by the app when a publisher/admin closes a job.
ALTER TYPE job_status ADD VALUE IF NOT EXISTS 'closed';
