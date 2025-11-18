# Image Resizer Lambda Function

This Lambda function automatically resizes images uploaded to S3 to optimize storage and improve performance.

## Resize Configurations

- **Venue Images** (`venue-images/`): Max 1200x1200px, 85% quality
- **Venue Logos** (`venue-logos/`): Max 500x500px, 90% quality  
- **Profile Images** (`profile-images/`): Max 500x500px, 90% quality
- **Show Images** (`show-images/`): Max 1200x1200px, 85% quality

## Setup Instructions

### 1. Add the function via Amplify CLI

```bash
amplify add function
```

When prompted:
- Function name: `imageResizer`
- Runtime: `Node.js 18.x`
- Template: `Hello World` (we'll replace it)
- Configure advanced settings: Yes
- Lambda layers: No
- Environment variables: No
- Secret values: No
- Enable schedule: No
- Lambda event sources: No

### 2. Replace the generated code

Replace the contents of `amplify/backend/function/imageResizer/src/index.js` with the provided code.

### 3. Install dependencies

```bash
cd amplify/backend/function/imageResizer/src
npm install sharp
```

### 4. Configure S3 trigger

After pushing, you'll need to configure the S3 bucket notification to trigger this Lambda. You can do this via:

**Option A: AWS Console**
1. Go to S3 → Your bucket → Properties → Event notifications
2. Create event notification:
   - Event types: `PUT`
   - Prefix: `venue-images/` or leave blank for all
   - Suffix: (leave blank)
   - Destination: Lambda function → `imageResizer`

**Option B: Add to storage CloudFormation template**

Add this to `amplify/backend/storage/s31c1a7e4e/s31c1a7e4e-cloudformation-template.json`:

```json
"ImageResizerInvokePermission": {
  "Type": "AWS::Lambda::Permission",
  "Properties": {
    "FunctionName": {
      "Fn::GetAtt": [
        {
          "Fn::Sub": "${functionimageResizer.Name}"
        },
        "Arn"
      ]
    },
    "Action": "lambda:InvokeFunction",
    "Principal": "s3.amazonaws.com",
    "SourceArn": {
      "Fn::GetAtt": ["S3Bucket", "Arn"]
    }
  }
},
"BucketNotification": {
  "Type": "AWS::S3::Bucket",
  "DependsOn": ["ImageResizerInvokePermission"],
  "Properties": {
    "Bucket": {
      "Ref": "S3Bucket"
    },
    "NotificationConfiguration": {
      "LambdaConfigurations": [
        {
          "Event": "s3:ObjectCreated:Put",
          "Function": {
            "Fn::GetAtt": [
              {
                "Fn::Sub": "${functionimageResizer.Name}"
              },
              "Arn"
            ]
          },
          "Filter": {
            "S3Key": {
              "Rules": [
                {
                  "Name": "prefix",
                  "Value": "venue-images/"
                }
              ]
            }
          }
        },
        {
          "Event": "s3:ObjectCreated:Put",
          "Function": {
            "Fn::GetAtt": [
              {
                "Fn::Sub": "${functionimageResizer.Name}"
              },
              "Arn"
            ]
          },
          "Filter": {
            "S3Key": {
              "Rules": [
                {
                  "Name": "prefix",
                  "Value": "venue-logos/"
                }
              ]
            }
          }
        },
        {
          "Event": "s3:ObjectCreated:Put",
          "Function": {
            "Fn::GetAtt": [
              {
                "Fn::Sub": "${functionimageResizer.Name}"
              },
              "Arn"
            ]
          },
          "Filter": {
            "S3Key": {
              "Rules": [
                {
                  "Name": "prefix",
                  "Value": "show-images/"
                }
              ]
            }
          }
        },
        {
          "Event": "s3:ObjectCreated:Put",
          "Function": {
            "Fn::GetAtt": [
              {
                "Fn::Sub": "${functionimageResizer.Name}"
              },
              "Arn"
            ]
          },
          "Filter": {
            "S3Key": {
              "Rules": [
                {
                  "Name": "prefix",
                  "Value": "profile-images/"
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

### 5. Deploy

```bash
amplify push
```

## How It Works

1. When an image is uploaded to S3, it triggers the Lambda function
2. The function checks the key prefix to determine resize settings
3. If the image exceeds the max dimensions, it's resized using Sharp
4. The resized image replaces the original in S3
5. Original quality is maintained while reducing file size

## Notes

- Images smaller than the max dimensions are not resized
- The function processes images asynchronously
- Sharp is used for high-performance image processing
- Images are optimized for web delivery with appropriate quality settings

