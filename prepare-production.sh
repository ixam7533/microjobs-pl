#!/bin/bash

# Skrypt przygotowania do produkcji na Render.com

echo "🚀 Przygotowanie do wdrożenia na Render.com..."

# 1. Sprawdź czy wszystkie pliki są poprawne
echo "📋 Sprawdzanie składni TypeScript..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ Błędy TypeScript - napraw je przed wdrożeniem"
    exit 1
fi

# 2. Sprawdź CSS
echo "📋 Sprawdzanie plików CSS..."
find . -name "*.css" -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
    echo "Sprawdzanie: $file"
done

# 3. Build aplikacji
echo "🔨 Budowanie aplikacji..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Błąd budowania - sprawdź logi"
    exit 1
fi

# 4. Test migracji bazy danych
echo "🗄️ Generowanie klienta Prisma..."
npx prisma generate

# 5. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
echo "🔧 Sprawdzanie zmiennych środowiskowych..."
REQUIRED_VARS=("JWT_SECRET" "NEXTAUTH_SECRET")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️  Zmienna $var nie jest ustawiona"
    else
        echo "✅ $var jest ustawiona"
    fi
done

echo "✅ Przygotowanie zakończone!"
echo ""
echo "📝 Następne kroki dla Render.com:"
echo "1. Ustaw Build Command: npm install && npm run build"  
echo "2. Ustaw Start Command: npm start"
echo "3. Ustaw wszystkie zmienne środowiskowe"
echo "4. Przekieruj domenę (opcjonalnie)"
echo ""
echo "🔗 Więcej informacji w pliku RENDER_CONFIG.md"
