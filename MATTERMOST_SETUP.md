# Mattermost Integration Setup

## Overview

The Design Request App can automatically send notifications to Mattermost when a design request is submitted. This allows your team to be notified immediately when new requests come in.

## Setup Instructions

### 1. Create a Mattermost Incoming Webhook

1. **Log into your Mattermost instance**
2. **Navigate to:** Menu → Integrations → Incoming Webhooks
3. **Click "Add Incoming Webhook"**
4. **Configure the webhook:**
   - **Title:** Design Request App (or your preferred name)
   - **Description:** Notifications for design requests
   - **Channel:** Select the channel where you want notifications (e.g., #design-requests)
   - **Username:** Design Request Bot (optional)
   - **Icon:** You can add a custom icon URL (optional)
5. **Click "Save"**
6. **Copy the webhook URL** - it will look like:
   ```
   https://your-mattermost.com/hooks/xxxxxxxxxxxxxxxxxxxxxx
   ```

### 2. Add Webhook URL to Environment Variables

#### For Local Development:

Add to your `.env.local` file:
```bash
MATTERMOST_WEBHOOK_URL=https://your-mattermost.com/hooks/xxxxxxxxxxxxxxxxxxxxxx
```

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name:** `MATTERMOST_WEBHOOK_URL`
   - **Value:** Your Mattermost webhook URL
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your project for the changes to take effect

### 3. Test the Integration

1. Submit a test design request through the app
2. Check your Mattermost channel - you should see a notification with:
   - Request area
   - Deadline
   - Assigned designer
   - What/Why/Context/Goals/Use Cases
   - Timestamp

## Notification Format

The Mattermost notification includes:
- **Title:** Design Request: [Area]
- **Fields:**
  - Area (e.g., Casino, Sports, Loyalty)
  - Deadline (e.g., ASAP, This week, Next week)
  - Assigned To (e.g., Lilly, Sam, Nek, Victor, CH)
  - What (the request description)
  - Why (the reason for the request)
  - Context (if provided)
  - Goals (if provided)
  - Use Cases (if provided)
- **Color:** Purple (#7B68EE) for visual distinction
- **Footer:** "Design Request App"
- **Timestamp:** When the request was submitted

## Troubleshooting

### Notifications not appearing?

1. **Check the webhook URL is correct**
   - Make sure there are no extra spaces
   - Verify the URL is complete

2. **Check Vercel logs**
   - Go to your Vercel project → Functions tab
   - Look at `/api/deliver` function logs
   - Check for any error messages

3. **Verify Mattermost webhook is active**
   - Go back to Mattermost → Integrations → Incoming Webhooks
   - Make sure the webhook is enabled

4. **Check environment variable**
   - In Vercel, verify `MATTERMOST_WEBHOOK_URL` is set
   - Make sure you redeployed after adding it

### Error: "Webhook URL not configured"

This means the `MATTERMOST_WEBHOOK_URL` environment variable is not set. Follow the setup instructions above to add it.

### Error: "HTTP 400" or "HTTP 401"

- **400:** The webhook URL might be incorrect or the payload format is wrong
- **401:** The webhook might have been disabled or the URL is invalid
- Check your Mattermost webhook settings and regenerate if needed

## Security Notes

- **Never commit the webhook URL to git** - it's already in `.gitignore`
- **Use different webhooks for different environments** if needed
- **Rotate webhook URLs** periodically for security
- **Limit webhook permissions** to only the channels that need notifications

## Next Steps

Once Mattermost is set up, you can:
- Set up Craft.io integration (when API details are available)
- Customize the notification format
- Add more fields or formatting
- Set up different channels for different request types
