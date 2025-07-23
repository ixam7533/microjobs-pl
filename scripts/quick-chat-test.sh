#!/bin/bash
echo "🚀 SZYBKI TEST CZATU"
echo "==================="

# Uruchom serwer jeśli nie działa
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "📡 Uruchamiam serwer..."
    cd "/Users/admin/Documents/Aplikacje IOS/microjobs"
    npm run dev &
    sleep 3
fi

echo "🌐 Otwórz przeglądarke na: http://localhost:3001"
echo ""
echo "🔑 DANE DO LOGOWANIA:"
echo "Email: test@example.com"
echo "Hasło: test123"
echo ""
echo "📋 KROKI TESTOWE:"
echo "1. Zaloguj się na stronie"
echo "2. Kliknij na jakąkolwiek ofertę"
echo "3. Kliknij 'Napisz wiadomość'"
echo "4. Otwórz DevTools (F12) i sprawdź Console"
echo ""
echo "🔍 W konsoli powinny pojawić się logi zaczynające się od:"
echo "- 🚀 Rozpoczynam chat..."
echo "- 🔍 Token znaleziony: true"
echo "- ✅ Chat utworzony: {chatId: X}"
echo ""
echo "❌ Jeśli nie widzisz logów lub są błędy, to znajdziemy przyczynę!"

# Uruchom diagnostic
echo ""
echo "🧪 Uruchamiam diagnostykę w tle..."
cd "/Users/admin/Documents/Aplikacje IOS/microjobs"
./scripts/test-chat.sh > chat_diagnostic.log 2>&1

echo "📊 Diagnostyka zapisana w chat_diagnostic.log"
