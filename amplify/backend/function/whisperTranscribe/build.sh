#!/bin/bash
# Build script for whisperTranscribe Lambda function

set -e

echo "Building whisperTranscribe Lambda function..."

# Create build directory
mkdir -p build

# Copy source files
cp -r src/* build/

# Install dependencies
cd build
npm install --production

# Create deployment package
cd ..
zip -r whisperTranscribe.zip build/*

echo "Build complete! Package: whisperTranscribe.zip"


