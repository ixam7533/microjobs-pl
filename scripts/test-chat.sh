#!/bin/bash
# Skrypt diagnostyczny systemu czatu

echo "💬 SYSTEM CZATU - DIAGNOSTYKA"
echo "============================="

cd "/Users/admin/Documents/Aplikacje IOS/microjobs"

# Sprawdź serwer
echo "📡 Sprawdzanie serwera..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Serwer działa"
else
    echo "❌ Serwer nie działa"
    exit 1
fi

# Sprawdź tabelę Chat w bazie danych
echo ""
echo "🗄️ Sprawdzanie bazy danych..."
CHAT_COUNT=$(echo "SELECT COUNT(*) FROM Chat;" | sqlite3 prisma/dev.db)
MESSAGE_COUNT=$(echo "SELECT COUNT(*) FROM Message;" | sqlite3 prisma/dev.db)
PARTICIPANT_COUNT=$(echo "SELECT COUNT(*) FROM ChatParticipant;" | sqlite3 prisma/dev.db)

echo "💬 Chaty: $CHAT_COUNT"
echo "📝 Wiadomości: $MESSAGE_COUNT"
echo "👥 Uczestnicy: $PARTICIPANT_COUNT"

# Test logowania
echo ""
echo "🔐 Test logowania..."
LOGIN_RESULT=$(curl -s -d '{"email":"test@example.com","password":"test123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/login)
echo "Odpowiedź logowania: $LOGIN_RESULT"

# Test API czatu (bez cookies, powinien zwrócić błąd autoryzacji)
echo ""
echo "🧪 Test API czatu (bez autoryzacji)..."
CHAT_NO_AUTH=$(curl -s -d '{"withEmail":"jan@example.com"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/chats/new)
echo "Bez autoryzacji: $CHAT_NO_AUTH"

# Test z autoryzacją
echo ""
echo "🧪 Test API czatu (z autoryzacją)..."
# Najpierw zaloguj się i zapisz cookie
curl -s -c test_cookies.txt -d '{"email":"test@example.com","password":"test123"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/login > /dev/null

# Teraz testuj API czatu
CHAT_WITH_AUTH=$(curl -s -b test_cookies.txt -d '{"withEmail":"jan@example.com"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/auth/chats/new)
echo "Z autoryzacją: $CHAT_WITH_AUTH"

# Wyczyść pliki testowe
rm -f test_cookies.txt

echo ""
echo "🔍 Pokaż istniejące chaty:"
echo "SELECT c.id, GROUP_CONCAT(u.email) as participants 
FROM Chat c 
LEFT JOIN ChatParticipant cp ON c.id = cp.chatId 
LEFT JOIN User u ON cp.userId = u.id 
GROUP BY c.id;" | sqlite3 -header prisma/dev.db

echo ""
echo "📋 INSTRUKCJE NAPRAWY:"
echo "1. Zaloguj się jako test@example.com (hasło: test123)"
echo "2. Otwórz DevTools (F12) i zobacz zakładkę Console"
echo "3. Kliknij na ofertę i 'Napisz wiadomość'"
echo "4. Sprawdź logi w konsoli"
echo ""
echo "🐛 Możliwe problemy:"
echo "- Token nie jest zapisywany w cookies"
echo "- Problem z funkcją handleChatStart"
echo "- Błąd w API /api/auth/chats/new"
echo "- Problem z przekierowaniem do /profile"
