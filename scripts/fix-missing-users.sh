#!/bin/bash

echo "🔧 Naprawiam brakujących użytkowników w bazie..."

cd "/Users/admin/Documents/Aplikacje IOS/microjobs"

# Pobierz wszystkie emaile z tabeli Offer
emails=$(sqlite3 prisma/dev.db "SELECT DISTINCT contactEmail FROM Offer;")

echo "📧 Znalezione emaile w ofertach:"
echo "$emails"

# Dla każdego emaila sprawdź czy użytkownik istnieje
for email in $emails; do
    exists=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM User WHERE email = '$email';")
    
    if [ "$exists" -eq 0 ]; then
        echo "➕ Dodaję użytkownika: $email"
        
        # Wygeneruj nazwę na podstawie emaila
        name=$(echo "$email" | cut -d'@' -f1 | sed 's/[0-9]*$//' | sed 's/.*/\L&/' | sed 's/\b./\u&/g')
        
        sqlite3 prisma/dev.db "INSERT INTO User (email, hash, confirmed, name) VALUES ('$email', '\$2b\$10\$dummy.hash.for.test', 1, '$name User');"
        
        echo "✅ Dodano: $email jako '$name User'"
    else
        echo "ℹ️  Istnieje: $email"
    fi
done

echo ""
echo "🎉 Sprawdzanie zakończone!"
echo "📊 Lista wszystkich użytkowników:"
sqlite3 prisma/dev.db "SELECT email, name FROM User ORDER BY email;"
