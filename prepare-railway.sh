#!/bin/bash

echo "🚀 Preparing for Railway deployment..."

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
npx prisma generate

# Run database migrations (only if DATABASE_URL is PostgreSQL)
if [[ $DATABASE_URL == postgresql* ]]; then
  echo "🔄 Running database migrations..."
  npx prisma migrate deploy
fi

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Railway deployment preparation complete!"
