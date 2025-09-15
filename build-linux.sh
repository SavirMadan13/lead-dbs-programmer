#!/bin/bash

# Linux Build Script for LeadDBSProgrammer
# This script ensures all dependencies are properly installed and builds the application for Linux

set -e

echo "🚀 Starting Linux build process..."

# Check if we're running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is designed for Linux systems only"
    exit 1
fi

# Check for required system dependencies
echo "📦 Checking system dependencies..."
REQUIRED_PACKAGES=(
    "build-essential"
    "libnss3-dev"
    "libatk-bridge2.0-dev"
    "libxss1"
    "libgconf-2-4"
    "libxrandr2"
    "libasound2-dev"
    "libpangocairo-1.0-0"
    "libatk1.0-dev"
    "libcairo1-dev"
    "libgtk-3-dev"
    "libgdk-pixbuf2.0-dev"
)

MISSING_PACKAGES=()
for package in "${REQUIRED_PACKAGES[@]}"; do
    if ! dpkg -l | grep -q "^ii  $package "; then
        MISSING_PACKAGES+=("$package")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -ne 0 ]; then
    echo "⚠️  Missing required packages: ${MISSING_PACKAGES[*]}"
    echo "🔧 Installing missing packages..."
    sudo apt-get update
    sudo apt-get install -y "${MISSING_PACKAGES[@]}"
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_NODE_VERSION="14.0.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE_VERSION or higher"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/ release/build/ .erb/dll/

# Install dependencies
echo "📥 Installing Node.js dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Package for Linux
echo "📦 Packaging for Linux..."
npm run package:linux

echo "✅ Linux build completed successfully!"
echo "📁 Build artifacts are in: ./release/build/"

# List generated files
echo "📋 Generated files:"
ls -la ./release/build/