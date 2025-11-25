# Whisper Transcription Setup Guide

This guide will help you set up the Whisper API audio transcription feature.

## What's Been Added

1. **Menu Section**: New "DevTools" → "AI Tools" → "Whisper Transcription" menu
   item
2. **Frontend Page**: `/devtools/whisper` - Audio file upload and transcription
   interface
3. **Lambda Function**: `whisperTranscribe` - Serverless function to call OpenAI
   Whisper API
4. **Local Storage**: Transcriptions are saved to browser localStorage for
   persistence

## Setup Steps

### 1. Add the Lambda Function

Run the Amplify CLI to add the function:

```bash
amplify add function
```

When prompted:

- Function name: `whisperTranscribe`
- Runtime: `Node.js 18.x`
- Template: `Hello World`
- Configure advanced settings: **Yes**
- Lambda layers: **No**
- Environment variables: **Yes**
  - Variable name: `OPENAI_API_KEY`
  - Value: (leave empty, you'll set it in step 3)
- Secret values: **No**
- Enable schedule: **No**
- Lambda event sources: **No**

After the function is created, replace the generated code with the code in:
`amplify/backend/function/whisperTranscribe/src/index.js`

### 2. Install Lambda Dependencies

```bash
cd amplify/backend/function/whisperTranscribe/src
npm install form-data busboy
cd ../../../../..
```

### 3. Set OpenAI API Key

You have two options:

**Option A: Via Amplify CLI**

```bash
amplify function update whisperTranscribe
# Select "Environment variables configuration"
# Update OPENAI_API_KEY with your actual API key
```

**Option B: Manual Edit** Edit `amplify/team-provider-info.json` and add:

```json
{
  "dev": {
    "categories": {
      "function": {
        "whisperTranscribe": {
          "openaiApiKey": "sk-your-actual-api-key-here"
        }
      }
    }
  }
}
```

### 4. Create API Gateway REST API

To expose the Lambda function via HTTP:

```bash
amplify add api
```

When prompted:

- Select: **REST**
- Resource name: `whisperapi` (or any name you prefer)
- Path: `/whisper`
- Lambda function: **whisperTranscribe**
- Restrict API access: **No** (or Yes if you want authentication)
- Additional authorization: **No**

### 5. Configure API Gateway for Binary Media

After the API is created, you need to configure it to handle file uploads:

1. Go to AWS Console → API Gateway
2. Find your API (named something like `whisperapi-xxxxx`)
3. Go to **Settings**
4. Under **Binary Media Types**, add: `multipart/form-data`
5. Click **Save Changes**
6. Go to **Actions** → **Deploy API**
7. Select your deployment stage (usually `dev` or `prod`)
8. Click **Deploy**

### 6. Get API Gateway URL

After deployment, copy the Invoke URL from the API Gateway console. It will look
like:

```
https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/whisper
```

### 7. Update Environment Variables

Create or update your `.env` file in the project root:

```bash
cp .env-example .env
```

Add the API Gateway URL:

```
VITE_WHISPER_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/whisper
VITE_OPENAI_API_KEY=sk-your-api-key-here  # Optional, only if needed in frontend
```

**Note**: The OpenAI API key should be set in the Lambda function's environment
variables (step 3), not in the frontend `.env` file for security.

### 8. Deploy Everything

```bash
amplify push
```

This will deploy:

- The Lambda function
- The API Gateway configuration
- Any other Amplify resources

### 9. Test the Feature

1. Start your development server: `yarn dev`
2. Navigate to the app and go to **DevTools** → **AI Tools** → **Whisper
   Transcription**
3. Upload an audio file (MP3, WAV, M4A, etc.)
4. Click "Transcribe Audio"
5. Wait for the transcription to complete
6. The transcription will be saved to localStorage automatically

## File Size Limits

- **API Gateway**: 10MB payload limit (for direct uploads)
- **OpenAI Whisper API**: 25MB limit
- **Current Implementation**: Supports files up to 10MB

For files larger than 10MB (like 90-minute voice memos), you'll need to:

1. Upload to S3 first
2. Pass the S3 URL to the Lambda function
3. Lambda downloads from S3 and processes

This enhancement can be added later if needed.

## Troubleshooting

### "Whisper API URL not configured" error

- Make sure `VITE_WHISPER_API_URL` is set in your `.env` file
- Restart your dev server after updating `.env`

### "OpenAI API key not configured" error

- Check that `OPENAI_API_KEY` is set in the Lambda function's environment
  variables
- Run `amplify push` to deploy the updated configuration

### CORS errors

- Make sure CORS is enabled in API Gateway
- Check that the Lambda function returns proper CORS headers (already included
  in the code)

### File upload fails

- Check file size (must be under 10MB for direct upload)
- Check browser console for detailed error messages
- Verify API Gateway is deployed and the URL is correct

### Transcription takes too long

- Large files can take several minutes
- Check Lambda function timeout (should be 300 seconds / 5 minutes)
- Check CloudWatch logs for the Lambda function to see progress

## Features

- ✅ Upload audio files (MP3, WAV, M4A, etc.)
- ✅ Transcribe using OpenAI Whisper API
- ✅ View transcription results
- ✅ Save transcriptions to localStorage (persists across page refreshes)
- ✅ View transcription history
- ✅ Delete old transcriptions
- ✅ File size validation
- ✅ Error handling and user feedback

## Future Enhancements

- [ ] Support for files larger than 10MB via S3 upload
- [ ] Export transcriptions as text files
- [ ] Search through transcription history
- [ ] Timestamp support in transcriptions
- [ ] Multiple language support
- [ ] Real-time transcription progress updates
