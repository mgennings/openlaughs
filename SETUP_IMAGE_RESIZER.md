# Image Resizer Setup Guide

This guide will help you set up automatic image resizing for uploaded images in
your Amplify app.

## Quick Setup (Recommended)

### Step 1: Add the Lambda Function via Amplify CLI

```bash
amplify add function
```

**When prompted, use these values:**

- Function name: `imageResizer`
- Runtime: `Node.js 18.x`
- Template: `Hello World` (we'll replace the code)
- Configure advanced settings: **Yes**
- Lambda layers: **No**
- Environment variables: **No**
- Secret values: **No**
- Enable schedule: **No**
- Lambda event sources: **No**

### Step 2: Replace the Function Code

The function code is already created at:
`amplify/backend/function/imageResizer/src/index.js`

If Amplify created a different structure, copy the code from that file to your
new function.

### Step 3: Install Dependencies

**Important:** Sharp needs to be compiled for Lambda's Linux environment (Amazon
Linux 2).

**Option A: Use Lambda Layer (Easiest - Recommended)**

1. Go to AWS Lambda Console → Layers
2. Create a new layer or use an existing Sharp layer
3. Common Sharp layer ARNs (us-east-1):
   - Search for "sharp" in AWS Lambda Layers marketplace
   - Or use: `arn:aws:lambda:us-east-1:553806908724:layer:sharp:1` (if you
     create one)
4. Attach the layer to your Lambda function

**Option B: Build Sharp for Lambda (Advanced)**

```bash
cd amplify/backend/function/imageResizer/src

# Option 1: Use Docker (recommended)
docker run -v "$PWD":/var/task public.ecr.aws/lambda/nodejs:18 npm install sharp

# Option 2: Use AWS SAM CLI
sam build --use-container

# Option 3: Manual build on Amazon Linux 2 EC2 instance
```

**Option C: Use Serverless Sharp (Alternative)**

If Sharp is too complex, you can modify the function to use a different image
processing library, but Sharp is the most performant.

### Step 4: Configure S3 Trigger

After the function is deployed, configure the S3 bucket to trigger it:

**Via AWS Console:**

1. Go to **S3** → Your bucket (`openlaughs2cce17ee491149a198096ab7f71061ef`)
2. Click **Properties** → **Event notifications**
3. Click **Create event notification**
4. Configure:
   - **Event name**: `ImageResizerTrigger`
   - **Prefix**: (leave blank or use specific prefixes)
   - **Suffix**: (leave blank)
   - **Event types**: Select `PUT`
   - **Destination**: Lambda function → Select `imageResizer`

Repeat for each prefix you want to monitor:

- `venue-images/`
- `venue-logos/`
- `show-images/`
- `profile-images/`

### Step 5: Deploy

```bash
amplify push
```

## Alternative: Manual Setup

If you prefer to set this up manually without using Amplify CLI:

1. The function code is already in `amplify/backend/function/imageResizer/`
2. You'll need to manually create the Lambda function in AWS Console
3. Upload the function code as a ZIP file (including node_modules)
4. Configure the S3 trigger as described above

## Resize Configurations

The function automatically resizes images based on their S3 key prefix:

- **`venue-images/`**: Max 1200x1200px, 85% quality
- **`venue-logos/`**: Max 500x500px, 90% quality
- **`profile-images/`**: Max 500x500px, 90% quality
- **`show-images/`**: Max 1200x1200px, 85% quality

## Testing

1. Upload a large image (e.g., 4MB, 3000x3000px) to your S3 bucket
2. Check CloudWatch Logs for the Lambda function to see processing
3. Verify the image in S3 has been resized

## Troubleshooting

**Sharp not found error:**

- Make sure Sharp is installed in the Lambda package
- Use a Lambda layer or build Sharp for Linux

**Function not triggering:**

- Verify S3 event notification is configured
- Check Lambda permissions allow S3 to invoke
- Verify the function is in the same region as the bucket

**Images not resizing:**

- Check CloudWatch logs for errors
- Verify the image key matches one of the configured prefixes
- Ensure the image format is supported (JPEG, PNG, WebP)

## Cost Considerations

- Lambda: ~$0.20 per 1M requests
- S3: Standard storage and request costs
- Sharp processing: Minimal compute time per image

For typical usage, this should cost less than $1/month.
