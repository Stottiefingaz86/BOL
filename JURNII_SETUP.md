# Jurnii Integration Setup

## Overview

The Design Request App can automatically extract UX reports from Jurnii using authentication credentials. This allows you to add Jurnii reports to the knowledge base without manual data entry.

## Security Warning

⚠️ **IMPORTANT**: Never commit Jurnii credentials to git. Always use environment variables.

## Setup Instructions

### 1. Get Your Jurnii Credentials

You'll need:
- Jurnii account email
- Jurnii account password

### 2. Add Credentials to Environment Variables

#### For Local Development:

Add to your `.env.local` file:
```bash
JURNII_EMAIL=your-email@example.com
JURNII_PASSWORD=your-password
```

**Note:** `.env.local` is already in `.gitignore` and will not be committed.

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Add two variables:
   - **Name:** `JURNII_EMAIL`
     - **Value:** Your Jurnii email
     - **Environment:** Production, Preview, Development
   - **Name:** `JURNII_PASSWORD`
     - **Value:** Your Jurnii password
     - **Environment:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** your project

### 3. Using the Integration

Once credentials are set, you can add Jurnii reports via the API:

```bash
POST /api/ux-report
Content-Type: application/json

{
  "url": "https://app.jurnii.io/user-reports/competitor/2c5eb20f-b28e-404c-a75f-515f22d9c004"
}
```

The system will:
1. Authenticate with Jurnii using your credentials
2. Fetch the report page
3. Extract structured data (using AI parsing if needed)
4. Add it to the knowledge base automatically

## How It Works

1. **Authentication**: 
   - Fetches the Jurnii login page to get session cookies
   - POSTs credentials to `/api/auth/login`
   - Stores authentication cookies for subsequent requests
2. **Scraping**: Fetches the report HTML using authenticated session
3. **AI Parsing**: Uses OpenAI to extract structured data from the HTML
4. **Storage**: Adds the structured report to the knowledge base

**Note**: The authentication endpoint may need adjustment based on Jurnii's actual API structure. If authentication fails, check the server logs for the exact error.

## AI-Powered Parsing

If the HTML structure is complex, the system uses OpenAI to:
- Extract findings and issues
- Determine severity levels
- Identify affected areas
- Generate recommendations

This requires `OPENAI_API_KEY` to be set (which you already have for the chat feature).

## Production Considerations

### Will This Work in Production (Vercel)?

**Yes, but you need to:**

1. **Set Environment Variables in Vercel** (required)
   - `JURNII_EMAIL` - Your Jurnii email
   - `JURNII_PASSWORD` - Your Jurnii password
   - `OPENAI_API_KEY` - For AI parsing (already set for chat)

2. **Redeploy After Adding Variables**
   - Environment variables only apply to new deployments
   - Go to Deployments → Redeploy

3. **Check Vercel Function Logs**
   - If authentication fails, check the logs for specific errors
   - The login endpoint might need adjustment based on Jurnii's actual API

### Potential Production Issues

1. **Cookie Handling**
   - ✅ Fixed: Uses standard `headers.get('set-cookie')` compatible with Vercel
   - Works in both local and production environments

2. **Serverless Function Timeout**
   - Vercel functions have a 10s timeout (Hobby) or 60s (Pro)
   - If Jurnii is slow, the request might timeout
   - Solution: Consider using a background job or increasing timeout

3. **Authentication Endpoint**
   - The login endpoint (`/api/auth/login`) might be different
   - Check Vercel logs if authentication fails
   - May need to adjust based on Jurnii's actual API structure

4. **Rate Limiting**
   - Jurnii might rate limit authentication attempts
   - If you see 429 errors, add retry logic or delays

## Troubleshooting

### "Credentials not configured"

- Make sure `JURNII_EMAIL` and `JURNII_PASSWORD` are set in environment variables
- For local: Check `.env.local` file
- For Vercel: Check Settings → Environment Variables
- **Redeploy after adding variables** (important!)

### "Authentication failed"

- Verify your Jurnii credentials are correct
- Check Vercel function logs for the exact error
- The login endpoint might be different (check logs)
- Check if Jurnii requires 2FA (may need additional handling)

### "Failed to extract data"

- The HTML structure may have changed
- Try using manual input instead
- Check Vercel logs for parsing errors
- Verify `OPENAI_API_KEY` is set for AI parsing

### "AI parsing failed"

- Make sure `OPENAI_API_KEY` is set in Vercel
- Check OpenAI API quota/limits
- Try manual input as fallback

### "Function timeout"

- Jurnii might be slow to respond
- Check Vercel function execution time in logs
- Consider upgrading to Pro plan for longer timeouts

## Security Best Practices

1. **Never commit credentials**
   - Already in `.gitignore`
   - Use environment variables only

2. **Rotate credentials periodically**
   - Change passwords regularly
   - Update environment variables when changed

3. **Use different credentials for different environments** (optional)
   - Production vs. Development
   - Separate accounts if possible

4. **Monitor access**
   - Check Jurnii account activity
   - Review Vercel logs for authentication attempts

## Alternative: Manual Input

If automatic extraction doesn't work, you can always use manual input:

```bash
POST /api/ux-report
{
  "manual": true,
  "reportData": {
    "id": "jurnii-001",
    "source": "Jurnii",
    "sourceUrl": "https://app.jurnii.io/...",
    "title": "UX Report",
    "findings": [...]
  }
}
```

See `UX_REPORT_SETUP.md` for manual input details.
