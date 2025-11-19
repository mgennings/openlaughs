const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

// Resize configurations based on key prefix
const RESIZE_CONFIGS = {
  'venue-images/': { maxWidth: 1600, maxHeight: 1600, quality: 95 },
  'venue-logos/': { maxWidth: 500, maxHeight: 500, quality: 95 },
  'profile-images/': { maxWidth: 500, maxHeight: 500, quality: 95 },
  'profile-avatars/': { maxWidth: 500, maxHeight: 500, quality: 95 },
  'show-images/': { maxWidth: 1600, maxHeight: 1600, quality: 95 },
  'comedian-profile-images/': { maxWidth: 800, maxHeight: 800, quality: 95 },
};

exports.handler = async event => {
  console.log('Image resizer triggered:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    // Only process PUT events (new uploads)
    if (record.eventName !== 'ObjectCreated:Put') {
      console.log('Skipping non-PUT event:', record.eventName);
      continue;
    }

    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    console.log(`Processing image: ${bucket}/${key}`);

    // Remove 'public/' prefix if present (Amplify Storage adds this for guest access)
    const normalizedKey = key.startsWith('public/') ? key.substring(7) : key;

    // Determine resize config based on normalized key prefix
    let resizeConfig = null;
    for (const [prefix, config] of Object.entries(RESIZE_CONFIGS)) {
      if (normalizedKey.startsWith(prefix)) {
        resizeConfig = config;
        console.log(`Found resize config for prefix: ${prefix}`);
        break;
      }
    }

    // Skip if no resize config found or if already processed (has -resized suffix)
    if (!resizeConfig || normalizedKey.includes('-resized')) {
      console.log(`Skipping ${key} - no resize config or already processed`);
      continue;
    }

    try {
      // Get the object from S3
      const s3Object = await s3
        .getObject({ Bucket: bucket, Key: key })
        .promise();

      // Check if it's an image
      const contentType = s3Object.ContentType || '';
      if (!contentType.startsWith('image/')) {
        console.log(`Skipping ${key} - not an image (${contentType})`);
        continue;
      }

      // Get image metadata
      const metadata = await sharp(s3Object.Body).metadata();
      console.log(
        `Original image: ${metadata.width}x${metadata.height}, ${metadata.format}`,
      );

      // Check if resizing is needed
      const needsResize =
        metadata.width > resizeConfig.maxWidth ||
        metadata.height > resizeConfig.maxHeight;

      if (!needsResize) {
        console.log(
          `Image ${key} is already within size limits, skipping resize`,
        );
        continue;
      }

      // Resize the image
      let resizedImage;
      const format =
        metadata.format === 'jpeg' || metadata.format === 'jpg'
          ? 'jpeg'
          : 'png';

      if (format === 'jpeg') {
        resizedImage = await sharp(s3Object.Body)
          .resize(resizeConfig.maxWidth, resizeConfig.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: resizeConfig.quality, mozjpeg: true })
          .toBuffer();
      } else {
        resizedImage = await sharp(s3Object.Body)
          .resize(resizeConfig.maxWidth, resizeConfig.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .png({ quality: resizeConfig.quality, compressionLevel: 9 })
          .toBuffer();
      }

      const resizedMetadata = await sharp(resizedImage).metadata();
      console.log(
        `Resized image: ${resizedMetadata.width}x${resizedMetadata.height}`,
      );

      // Calculate size reduction
      const originalSize = s3Object.Body.length;
      const resizedSize = resizedImage.length;
      const reduction = (
        ((originalSize - resizedSize) / originalSize) *
        100
      ).toFixed(2);
      console.log(
        `Size: ${(originalSize / 1024).toFixed(2)}KB -> ${(resizedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`,
      );

      // Upload the resized image back to S3, replacing the original
      await s3
        .putObject({
          Bucket: bucket,
          Key: key,
          Body: resizedImage,
          ContentType: contentType,
          CacheControl: 'max-age=31536000', // 1 year cache
        })
        .promise();

      console.log(`Successfully resized and replaced ${key}`);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
      // Don't throw - continue processing other images
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Image processing completed' }),
  };
};
