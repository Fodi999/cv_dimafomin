# OpenAI API Setup Guide

This guide will help you set up OpenAI API for AI Culinary Recommendations feature.

## Overview

The AI Culinary Recommendations feature uses OpenAI's GPT-4o-mini model to analyze user's learning progress and suggest personalized course recommendations.

## Prerequisites

- OpenAI account
- Credit card for API usage (or prepaid credits)
- Basic understanding of API keys and environment variables

## Step-by-Step Setup

### 1. Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Click "Sign up" and create an account
3. Verify your email address

### 2. Add Payment Method

1. Navigate to [Billing Settings](https://platform.openai.com/account/billing)
2. Click "Add payment method"
3. Enter your credit card details or purchase prepaid credits
4. Set up auto-recharge if desired (recommended: $5-10 minimum)

### 3. Create API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "CV Sushi Chef Academy")
4. Copy the key immediately (you won't be able to see it again!)
5. Store it securely

### 4. Configure Environment Variable

1. Open `.env.local` in your project root
2. Find the line: `OPENAI_API_KEY=your_openai_api_key_here`
3. Replace `your_openai_api_key_here` with your actual API key:
   ```bash
   OPENAI_API_KEY=sk-proj-abc123...xyz
   ```
4. Save the file
5. Restart your development server

### 5. Verify Configuration

The AI recommendations will automatically work once configured. You can test it by:

1. Navigate to `/academy/dashboard`
2. Check the "AI Recommendations" section
3. If configured correctly, you'll see personalized course suggestions
4. If not configured, you'll see default mock recommendations with a note

## API Usage & Costs

### GPT-4o-mini Pricing (as of 2024)
- Input: $0.15 per 1M tokens (~$0.0001 per recommendation)
- Output: $0.60 per 1M tokens (~$0.0003 per recommendation)
- **Average cost per recommendation: ~$0.0004** (less than a cent)

### Expected Monthly Usage
- **Low usage** (10 users/day): ~$0.12/month
- **Medium usage** (100 users/day): ~$1.20/month
- **High usage** (1000 users/day): ~$12/month

### Rate Limits
- Free tier: 200 requests per day (RPD)
- Tier 1: 500 RPD
- Tier 2: 5,000 RPD

## How It Works

### 1. User Profile Analysis
The AI analyzes:
- Completed courses
- User's skill level
- Bio and preferences
- Learning history

### 2. Recommendation Generation
The system sends a prompt to GPT-4o-mini:
```
Użytkownik ukończył kurs "Podstawy Sushi".
Zaproponuj 2-3 następne kursy kulinarne w stylu fusion lub sushi advanced.
```

### 3. Response Processing
The AI returns structured recommendations:
```json
{
  "recommendations": [
    {
      "title": "Advanced Sushi Techniques",
      "description": "Master professional-level sushi preparation",
      "level": "Zaawansowany",
      "reason": "Perfect next step after basics",
      "estimatedDuration": "8 tygodni",
      "difficulty": "advanced"
    }
  ]
}
```

## Troubleshooting

### Error: "OpenAI API key not configured"
**Solution**: Check that `OPENAI_API_KEY` is set in `.env.local` and restart the server.

### Error: "Insufficient credits"
**Solution**: Add funds to your OpenAI account billing section.

### Error: "Rate limit exceeded"
**Solution**: Implement caching or upgrade your OpenAI tier.

### Mock Recommendations Showing
**Cause**: API key not configured or invalid.
**Solution**: Verify your API key is correct and properly set.

## Best Practices

### 1. Security
- ✅ Never commit `.env.local` to git
- ✅ Use different API keys for development and production
- ✅ Rotate keys regularly
- ✅ Monitor usage in OpenAI dashboard

### 2. Cost Optimization
- ✅ Cache recommendations for 24 hours
- ✅ Limit to 3 recommendations per request
- ✅ Use GPT-4o-mini instead of GPT-4 (90% cheaper)
- ✅ Set reasonable max_tokens limit (800)

### 3. Error Handling
- ✅ Fallback to mock data on API errors
- ✅ Log errors for monitoring
- ✅ Show user-friendly error messages
- ✅ Implement retry logic for transient failures

## Production Deployment

### Vercel
1. Go to project settings
2. Add environment variable: `OPENAI_API_KEY`
3. Paste your API key
4. Redeploy the application

### Other Platforms
Add `OPENAI_API_KEY` to your platform's environment variables section.

## Monitoring & Analytics

### OpenAI Dashboard
Monitor your usage at: https://platform.openai.com/usage

Track:
- Daily API calls
- Token usage
- Costs
- Error rates

### Recommended Alerts
Set up alerts for:
- Daily spend > $5
- Error rate > 10%
- Rate limit warnings

## Support

- **OpenAI Help**: https://help.openai.com
- **API Docs**: https://platform.openai.com/docs
- **Community**: https://community.openai.com

## License & Terms

Make sure to comply with OpenAI's [Usage Policies](https://openai.com/policies/usage-policies) and [Terms of Service](https://openai.com/policies/terms-of-use).
