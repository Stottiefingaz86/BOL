# OpenAI API Setup

To enable AI-powered responses from CH, you need to set up an OpenAI API key.

## Steps

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (you won't be able to see it again!)

2. **Install the OpenAI Package**
   ```bash
   npm install openai
   ```

3. **Create Environment File**
   - Create a file named `.env.local` in the root of the project
   - Add your API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Restart Your Dev Server**
   - Stop your current dev server (Ctrl+C)
   - Start it again: `npm run dev`

## How It Works

- **With OpenAI API Key**: CH uses GPT-4o-mini to generate natural, conversational responses based on the design system knowledge
- **Without API Key**: CH falls back to enhanced keyword-based responses (still works, just less AI-powered)

## Model Options

By default, the system uses `gpt-4o-mini` for cost-effectiveness. You can change this in `app/api/chat/route.ts`:

```typescript
model: 'gpt-4o-mini', // Change to 'gpt-4' for better quality (more expensive)
```

## Cost Considerations

- `gpt-4o-mini`: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- `gpt-4`: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens

The system is configured to use minimal tokens for cost efficiency.

## Troubleshooting

- **"OpenAI not installed"**: Run `npm install openai`
- **"API key not found"**: Make sure `.env.local` exists and has `OPENAI_API_KEY=your-key`
- **"Invalid API key"**: Check that your key starts with `sk-` and is correct
- **Still using fallback**: Check the server console for error messages

## Security

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Don't share your API key publicly
- The API key is only used server-side, never exposed to the client
