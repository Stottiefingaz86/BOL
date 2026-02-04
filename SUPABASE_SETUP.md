# Supabase Setup for Knowledge Base

This guide will help you set up Supabase to persist the knowledge base, UX reports, Figma assets, and all design system data.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `AI Agency Knowledge Base`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Wait for project to be created (~2 minutes)

## 2. Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Set Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lfqqawtllsclxdlcsdkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXFhd3RsbHNjbHhkbGNzZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjY3MDMsImV4cCI6MjA4NDIwMjcwM30.kVcjW0LO5Wz840UEja6WKdFvmfYE-3NcuLhlyiTy3Lg
```

✅ **Credentials have been added to `.env.local`**

## 4. Run Database Migrations

**IMPORTANT**: You need to run the migration SQL in your Supabase project.

1. Go to your Supabase project dashboard: https://lfqqawtllsclxdlcsdkj.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL from `supabase/migrations/001_initial_schema.sql` or `scripts/run-migration.sql`
5. Click "Run" to execute the migration

This will create all the tables needed for the knowledge base.

## 5. Verify Setup

```bash
npm run db:test
```

## Database Schema

The knowledge base will store:

- **ux_reports**: UX findings, Jurnii reports, website analyses, Google search results
- **figma_assets**: Extracted components, colors, typography, logos from Figma
- **design_tokens**: Color tokens, spacing, typography tokens
- **stakeholders**: Team members and their roles
- **processes**: Design processes and workflows
- **knowledge_notes**: Additional notes and insights

All data is automatically synced and available to CH (Head of UX/CX and Design).
