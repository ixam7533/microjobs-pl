#!/bin/bash
echo "🔐 DIAGNOSTYKA AUTORYZACJI"
echo "=========================="

cd "/Users/admin/Documents/Aplikacje IOS/microjobs"

echo "🧪 Test 1: Logowanie przez API"
echo "curl -c test_cookies.txt -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}' -H 'Content-Type: application/json' -X POST http://localhost:3001/api/auth/login"
LOGIN_RESPONSE=$(curl -c test_cookies.txt -d '{"email":"test@example.com","password":"test123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/login 2>/dev/null)
echo "Odpowiedź logowania: $LOGIN_RESPONSE"

if [ -f test_cookies.txt ]; then
    echo ""
    echo "🍪 Zapisane cookies:"
    cat test_cookies.txt
else
    echo "❌ Plik cookies nie został utworzony"
fi

echo ""
echo "🧪 Test 2: Sprawdzenie /api/auth/me"
ME_RESPONSE=$(curl -b test_cookies.txt http://localhost:3001/api/auth/me 2>/dev/null)
echo "Odpowiedź /api/auth/me: $ME_RESPONSE"

echo ""
echo "🧪 Test 3: Test API czatu"
CHAT_RESPONSE=$(curl -b test_cookies.txt -d '{"withEmail":"jan@example.com"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/chats/new 2>/dev/null)
echo "Odpowiedź czatu: $CHAT_RESPONSE"

echo ""
echo "🧪 Test 4: Test API ocen"
RATING_RESPONSE=$(curl -b test_cookies.txt -d '{"reviewedEmail":"jan@example.com","rating":5,"comment":"Test","offerId":1}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/ratings/add 2>/dev/null)
echo "Odpowiedź oceny: $RATING_RESPONSE"

# Wyczyść pliki testowe
rm -f test_cookies.txt

echo ""
echo "📋 ANALIZA:"
echo "1. Jeśli logowanie zwraca {\"email\":\"test@example.com\"} - ✅ OK"
echo "2. Jeśli /api/auth/me zwraca {\"user\":{...}} - ✅ OK"
echo "3. Jeśli chat zwraca {\"chatId\":X} - ✅ OK"
echo "4. Jeśli rating zwraca {\"message\":\"Ocena została dodana\"} - ✅ OK"
echo ""
echo "❌ Jeśli któryś test się nie udaje, sprawdź logi serwera!"
