#!/bin/bash

# ==============================================================================
# Portfolio Automated Deployment Script
# ==============================================================================
# This script automates pulling the latest code, compiling the React production
# build, copying assets to the Nginx root directory, and reloading the server.
#
# Usage (run on the VM):
#   chmod +x deploy.sh
#   ./deploy.sh
# ==============================================================================

# Stop script on any error
set -e

# Target paths (Sync with skill.md)
PROJECT_DIR="$HOME/portofolio-temp"
NGINX_ROOT="/var/www/html/portofolio-saya"

echo "🚀 Starting deployment process..."

# Navigate to project folder
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo "📂 Navigated to: $PROJECT_DIR"
else
    echo "❌ Error: Project directory $PROJECT_DIR does not exist."
    exit 1
fi

# 1. Pull latest code from Git
echo "🔄 Pulling latest changes from GitHub..."
git pull origin main

# 2. Install dependencies & run production build
echo "📦 Installing npm dependencies..."
npm install

echo "⚡ Compiling static build assets..."
npm run build

# 3. Deploy assets to Nginx web root
echo "📋 Deploying build assets to Nginx root: $NGINX_ROOT..."
sudo mkdir -p "$NGINX_ROOT"

# Clean old files to prevent clutter
echo "🧹 Cleaning previous build files..."
sudo rm -rf "$NGINX_ROOT"/*

# Copy new dist files
sudo cp -r dist/* "$NGINX_ROOT"/

# 4. Set permissions
echo "🔒 Adjusting file permissions for Nginx..."
sudo chown -R www-data:www-data "$NGINX_ROOT"

# 5. Reload Nginx
echo "⚙️ Reloading Nginx server..."
sudo systemctl reload nginx

echo "🎉 Deployment successful! Your website is live and secure."
