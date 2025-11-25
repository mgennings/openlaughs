# Whisper Transcription Lambda Function

This Lambda function transcribes audio files using OpenAI's Whisper API.

## Setup Instructions

### 1. Add the function via Amplify CLI

```bash
amplify add function
```

When prompted:

- Function name: `whisperTranscribe`
- Runtime: `Node.js 18.x`
- Template: `Hello World` (we'll replace it)
- Configure advanced settings: Yes
- Lambda layers: No
- Environment variables: Yes
  - Add: `OPENAI_API_KEY` (you'll set the value later)
- Secret values: No
- Enable schedule: No
- Lambda event sources: No

### 2. Replace the generated code

Replace the contents of
`amplify/backend/function/whisperTranscribe/src/index.js` with the provided
code.

### 3. Install dependencies

```bash
cd amplify/backend/function/whisperTranscribe/src
npm install form-data busboy
```

### 4. Set OpenAI API Key

Set the OpenAI API key as an environment variable:

```bash
amplify env get
# Note your environment name, then:
amplify function update whisperTranscribe
# Select "Environment variables configuration"
# Add OPENAI_API_KEY with your OpenAI API key value
```

Or manually edit `amplify/team-provider-info.json` to add:

```json
{
  "function": {
    "whisperTranscribe": {
      "openaiApiKey": "your-openai-api-key-here"
    }
  }
}
```

### 5. Create API Gateway REST API

To expose this Lambda function via HTTP, create a REST API:

```bash
amplify add api
```

When prompted:

- Select: REST
- Resource name: `whisperapi`
- Path: `/whisper`
- Lambda function: `whisperTranscribe`
- Restrict API access: No (or Yes if you want to add auth)
- Additional authorization: No

### 6. Configure API Gateway for Binary Media

For file uploads, you need to configure API Gateway to handle binary media:

1. Go to AWS Console → API Gateway
2. Select your API
3. Go to Settings
4. Add `multipart/form-data` to Binary Media Types
5. Deploy the API

Alternatively, you can add this to the API Gateway CloudFormation template.

### 7. Update Frontend Environment Variable

Update your `.env` file with the API Gateway URL:

```
VITE_WHISPER_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod/whisper
```

### 8. Deploy

```bash
amplify push
```

## How It Works

1. Frontend uploads audio file as multipart/form-data to API Gateway
2. API Gateway forwards the request to Lambda
3. Lambda parses the multipart data using Busboy
4. Lambda sends the audio file to OpenAI Whisper API
5. Lambda returns the transcription text to the frontend
6. Frontend stores the transcription in localStorage

## File Size Limits

- API Gateway payload limit: 10MB (for direct uploads)
- OpenAI Whisper API limit: 25MB
- For files larger than 10MB, consider:
  1. Uploading to S3 first
  2. Passing S3 URL to Lambda
  3. Lambda downloads from S3 and processes

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Notes

- The function handles CORS for browser requests
- Timeout is set to 300 seconds (5 minutes) to handle long audio files
- Memory is set to 1024MB (adjust if needed for larger files)
- The function uses the `whisper-1` model by default
