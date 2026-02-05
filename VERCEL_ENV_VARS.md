# Vercel Environment Variables

Copy these environment variables to your Vercel project:

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable below (Key = Name, Value = Value)
4. Select **Production**, **Preview**, and **Development** (or as needed)
5. Click **Save**

## Supabase Environment Variables

### Key: `NEXT_PUBLIC_SUPABASE_URL`
**Value:**
```
https://lfqqawtllsclxdlcsdkj.supabase.co
```

### Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXFhd3RsbHNjbHhkbGNzZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjY3MDMsImV4cCI6MjA4NDIwMjcwM30.kVcjW0LO5Wz840UEja6WKdFvmfYE-3NcuLhlyiTy3Lg
```

## Complete Environment Variables List

If you need all environment variables, here's the complete list:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfqqawtllsclxdlcsdkj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXFhd3RsbHNjbHhkbGNzZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjY3MDMsImV4cCI6MjA4NDIwMjcwM30.kVcjW0LO5Wz840UEja6WKdFvmfYE-3NcuLhlyiTy3Lg` |
| `OPENAI_API_KEY` | `(your OpenAI key)` |
| `MATTERMOST_WEBHOOK_URL` | `(your Mattermost webhook URL - optional)` |
| `JURNII_EMAIL` | `(your Jurnii email - optional)` |
| `JURNII_PASSWORD` | `(your Jurnii password - optional)` |
| `GOOGLE_API_KEY` | `(your Google API key - optional)` |
| `GOOGLE_CSE_ID` | `(your Google CSE ID - optional)` |

## Quick Copy for Vercel

### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://lfqqawtllsclxdlcsdkj.supabase.co`

### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcXFhd3RsbHNjbHhkbGNzZGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjY3MDMsImV4cCI6MjA4NDIwMjcwM30.kVcjW0LO5Wz840UEja6WKdFvmfYE-3NcuLhlyiTy3Lg`

## After Adding to Vercel

1. **Redeploy** your application for the changes to take effect
2. The knowledge base will now use Supabase for persistent storage
3. All UX reports, Figma assets, and knowledge will be stored in Supabase
