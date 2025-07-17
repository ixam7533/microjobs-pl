#!/bin/bash

echo "🔧 Konfiguracja OAuth dla microjobs"
echo "===================================="
echo ""

# Sprawdź czy plik .env.local istnieje
if [ ! -f ".env.local" ]; then
    echo "❌ Plik .env.local nie istnieje!"
    exit 1
fi

echo "📋 Aktualne klucze OAuth:"
echo "Google Client ID: $(grep GOOGLE_CLIENT_ID .env.local | cut -d'=' -f2)"
echo "Facebook Client ID: $(grep FACEBOOK_CLIENT_ID .env.local | cut -d'=' -f2)"
echo ""

echo "🎯 Aby skonfigurować OAuth:"
echo "1. Google: https://console.cloud.google.com/"
echo "2. Facebook: https://developers.facebook.com/"
echo ""

echo "📝 Redirect URI dla localhost:"
echo "Google: http://localhost:3000/api/auth/callback/google"
echo "Facebook: http://localhost:3000/api/auth/callback/facebook"
echo ""

echo "⚙️ Po otrzymaniu kluczy, zaktualizuj .env.local:"
echo "GOOGLE_CLIENT_ID=twoj_prawdziwy_client_id"
echo "GOOGLE_CLIENT_SECRET=twoj_prawdziwy_client_secret"
echo "FACEBOOK_CLIENT_ID=twoj_prawdziwy_app_id"
echo "FACEBOOK_CLIENT_SECRET=twoj_prawdziwy_app_secret"
echo ""

echo "🔄 Następnie zrestartuj serwer: npm run dev"
