# How to Run Supabase Migrations

## Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the migration SQL from `supabase/migrations/002_add_jurnii_sections.sql`:

```sql
-- Add Jurnii-specific sections to ux_reports table
ALTER TABLE ux_reports 
ADD COLUMN IF NOT EXISTS executive_summary TEXT,
ADD COLUMN IF NOT EXISTS perception JSONB,
ADD COLUMN IF NOT EXISTS journey JSONB,
ADD COLUMN IF NOT EXISTS trends JSONB,
ADD COLUMN IF NOT EXISTS performance JSONB,
ADD COLUMN IF NOT EXISTS checking JSONB;
```

6. Click **Run** to execute the migration
7. Verify success: Check the table structure in **Table Editor** → `ux_reports`

## Option 2: Using Supabase CLI (if installed)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## Option 3: Direct SQL Connection

If you have direct database access, run the SQL directly using `psql` or your database client.

## Verify Migration

After running the migration, verify the columns were added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ux_reports';
```

You should see the new columns:
- executive_summary
- perception
- journey
- trends
- performance
- checking
