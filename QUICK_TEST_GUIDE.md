# Quick Test Guide - Whisper Transcription

## Step 1: Add the Lambda Function (if not already added)

```bash
amplify add function
```

**When prompted:**

- Function name: `whisperTranscribe`
- Runtime: `Node.js 18.x` (or latest available)
- Template: `Hello World`
- Configure advanced settings: **Yes**
- Lambda layers: **No**
- Environment variables: **Yes**
  - Variable name: `OPENAI_API_KEY`
  - Value: `sk-your-actual-openai-api-key-here` (paste your real key)
- Secret values: **No**
- Enable schedule: **No**
- Lambda event sources: **No**

**After it's created**, the function code is already in place at:
`amplify/backend/function/whisperTranscribe/src/index.js`

## Step 2: Install Lambda Dependencies

```bash
cd amplify/backend/function/whisperTranscribe/src
npm install form-data busboy
cd ../../../../..
```

## Step 3: Create API Gateway REST API

```bash
amplify add api
```

**When prompted:**

- Select: **REST**
- Resource name: `whisperapi` (or any name)
- Path: `/whisper`
- Lambda function: **whisperTranscribe**
- Restrict API access: **No** (for testing, you can add auth later)
- Additional authorization: **No**

## Step 4: Configure API Gateway for File Uploads

After `amplify push`, you need to configure binary media types:

1. Go to [AWS Console → API Gateway](https://console.aws.amazon.com/apigateway/)
2. Find your API (should be named `whisperapi-xxxxx` or similar)
3. Click on **Settings** in the left sidebar
4. Under **Binary Media Types**, add: `multipart/form-data`
5. Click **Save Changes**
6. Go to **Actions** → **Deploy API**
7. Select your deployment stage (usually `dev`)
8. Click **Deploy**

## Step 5: Get the API Gateway URL

After deployment:

1. In API Gateway console, click on your API
2. Click on **Stages** in the left sidebar
3. Click on your stage (usually `dev`)
4. Copy the **Invoke URL** - it will look like:
   ```
   https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
   ```
5. Add `/whisper` to the end:
   ```
   https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/whisper
   ```

## Step 6: Set Frontend Environment Variable

Create or update `.env` file in project root:

```bash
# If .env doesn't exist, copy from example
cp .env-example .env
```

Add this line (replace with your actual API Gateway URL):

```
VITE_WHISPER_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/whisper
```

## Step 7: Deploy Everything

```bash
amplify push
```

This will:

- Build and deploy the Lambda function
- Deploy API Gateway
- Set environment variables

**Note:** If you need to update the OpenAI API key later:

```bash
amplify function update whisperTranscribe
# Select "Environment variables configuration"
# Update OPENAI_API_KEY value
amplify push
```

## Step 8: Test Locally

1. **Restart your dev server** (to pick up new env vars):

   ```bash
   # Stop current server (Ctrl+C)
   yarn dev
   ```

2. **Navigate to the page:**

   - Go to: `http://localhost:5173/devtools/whisper`
   - Or use the menu: **DevTools** → **AI Tools** → **Whisper Transcription**

3. **Upload a test audio file:**

   - Drag and drop or click to upload
   - File should be under 10MB (API Gateway limit)
   - Supported formats: MP3, WAV, M4A, etc.

4. **Click "Transcribe Audio"**
   - Wait for upload and transcription
   - Should see the transcribed text appear

## Troubleshooting

### "Whisper API URL not configured"

- Check `.env` file has `VITE_WHISPER_API_URL` set
- Restart dev server after changing `.env`

### "OpenAI API key not configured"

- Check Lambda function has `OPENAI_API_KEY` environment variable
- Run `amplify push` to deploy changes
- Verify in AWS Console → Lambda → whisperTranscribe → Configuration →
  Environment variables

### CORS errors

- Make sure API Gateway is deployed (Step 4)
- Check Lambda function returns CORS headers (already in code)

### 413 Payload Too Large

- File is over 10MB
- Use a smaller test file first

### 502 Bad Gateway or 500 errors

- Check CloudWatch logs:
  ```bash
  amplify function logs whisperTranscribe
  ```
- Or in AWS Console → Lambda → whisperTranscribe → Monitor → View logs in
  CloudWatch

### Function timeout

- Large files can take time
- Lambda timeout is set to 300 seconds (5 minutes)
- Check CloudWatch logs to see progress

## Quick Test Audio File

You can create a simple test audio file:

- Record a short voice memo on your phone
- Or use any MP3 file under 10MB
- Or download a sample from the internet

## Next Steps After Testing

Once it works:

- ✅ Add authentication to API Gateway if needed
- ✅ Increase file size limit with S3 upload (for 90-minute files)
- ✅ Add progress indicators
- ✅ Add more error handling
