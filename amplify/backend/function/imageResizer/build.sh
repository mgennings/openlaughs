#!/bin/bash
# Build script for imageResizer Lambda function

set -e

echo "Building imageResizer Lambda function..."

# Create build directory
mkdir -p build

# Copy source files
cp -r src/* build/

# Install dependencies
cd build
npm install --production

# Create deployment package
cd ..
zip -r imageResizer.zip build/*

echo "Build complete! Package: imageResizer.zip"

