# Vercel Production Setup

## Why Chat Works Locally But Not in Production

The chat uses OpenAI API when available, but falls back to a simpler design system knowledge base when the API key is not set. In production (Vercel), you need to set the `OPENAI_API_KEY` environment variable.

## How to Set Up OpenAI API Key in Vercel

1. **Go to your Vercel project dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project

2. **Open Settings → Environment Variables**
   - Click on your project
   - Go to "Settings" tab
   - Click "Environment Variables" in the sidebar

3. **Add the API Key**
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-proj-...`)
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. **Redeploy**
   - After adding the environment variable, you need to redeploy
   - Go to "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Select "Redeploy"

## Verify It's Working

After redeploying, check the Vercel function logs:

1. Go to your project → "Functions" tab
2. Click on `/api/chat` function
3. Look at the logs - you should see:
   - ✅ `"Using OpenAI API for chat response"` = AI is working
   - ❌ `"OpenAI API key not found"` = API key not set correctly

## Troubleshooting

### Still not working?

1. **Check the API key is correct**
   - Make sure there are no extra spaces
   - The key should start with `sk-proj-`

2. **Check environment variable name**
   - Must be exactly: `OPENAI_API_KEY` (case-sensitive)

3. **Redeploy after adding the variable**
   - Environment variables only apply to new deployments

4. **Check Vercel logs**
   - Look for errors in the function logs
   - Check if the API key is being read (should see environment check logs)

## Mattermost Integration

To enable Mattermost notifications when design requests are submitted:

1. **Get your Mattermost webhook URL**
   - In Mattermost, go to Integrations → Incoming Webhooks
   - Create a new webhook or use an existing one
   - Copy the webhook URL

2. **Add to Vercel Environment Variables**
   - Go to your Vercel project → Settings → Environment Variables
   - Add:
     - **Name:** `MATTERMOST_WEBHOOK_URL`
     - **Value:** Your Mattermost webhook URL (e.g., `https://your-mattermost.com/hooks/xxxxx`)
     - **Environment:** Production, Preview, Development

3. **Redeploy**
   - After adding the variable, redeploy your project

When a design request is submitted, it will automatically send a formatted notification to your Mattermost channel with all the request details.

## Fallback Mode

If the API key is not set, the chat will use a fallback design system knowledge base. This is less comprehensive than the AI responses but should still answer basic questions about:
- Colors and tokens
- Brand information
- Components
- Typography

However, for best results, set up the OpenAI API key in Vercel.
