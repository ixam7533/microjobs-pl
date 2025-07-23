#!/bin/bash
# Skrypt do szybkiego testowania systemu ocen

echo "🔍 SYSTEM OCEN - STATUS DIAGNOSTYCZNY"
echo "======================================"

# Sprawdź czy serwer działa
echo "📡 Sprawdzanie serwera deweloperskiego..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Serwer działa na http://localhost:3001"
else
    echo "❌ Serwer nie działa - uruchom 'npm run dev'"
    exit 1
fi

# Sprawdź bazę danych
echo ""
echo "🗄️ Sprawdzanie bazy danych..."
cd "/Users/admin/Documents/Aplikacje IOS/microjobs"

USER_COUNT=$(echo "SELECT COUNT(*) FROM User;" | sqlite3 prisma/dev.db)
RATING_COUNT=$(echo "SELECT COUNT(*) FROM Rating;" | sqlite3 prisma/dev.db) 
OFFER_COUNT=$(echo "SELECT COUNT(*) FROM Offer;" | sqlite3 prisma/dev.db)

echo "👥 Użytkownicy: $USER_COUNT"
echo "⭐ Oceny: $RATING_COUNT"
echo "📋 Oferty: $OFFER_COUNT"

# Pokaż przykładowe oceny
echo ""
echo "📊 Ostatnie oceny:"
echo "SELECT 
  reviewer.email || ' -> ' || reviewed.email as 'Kto -> Kogo',
  rating || '⭐' as 'Ocena',
  substr(comment, 1, 30) || '...' as 'Komentarz'
FROM Rating 
LEFT JOIN User reviewer ON reviewer.id = reviewerId 
LEFT JOIN User reviewed ON reviewed.id = reviewedId 
ORDER BY Rating.createdAt DESC 
LIMIT 5;" | sqlite3 -header prisma/dev.db

echo ""
echo "🧪 INSTRUKCJE TESTOWANIA:"
echo "1. Otwórz http://localhost:3001"
echo "2. Zaloguj się jako ixam7533@gmail.com lub bibleversememory7@gmail.com"
echo "3. Kliknij na dowolną ofertę"
echo "4. Kliknij 'Wystaw ocenę' (w trybie dev możesz ocenić samego siebie)"
echo "5. Sprawdź profil użytkownika: http://localhost:3001/user/[email]"
echo ""
echo "💡 W trybie deweloperskim można oceniać samego siebie!"
echo "💡 Boty zostały utworzone jako pełnoprawni użytkownicy"
