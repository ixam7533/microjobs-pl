#!/bin/bash

# Skrypt do usunięcia wszystkich document.cookie tokenów i Authorization headers

echo "🔧 Usuwam wszystkie problematyczne tokeny..."

files=(
  "components/AdBlocker.tsx"
  "components/AccountSettings.tsx" 
  "components/SubscriptionManager.tsx"
  "pages/profile.tsx"
  "pages/pro.tsx"
)

for file in "${files[@]}"; do
  echo "📝 Naprawiam: $file"
  
  # Tymczasowy plik
  temp_file="/tmp/fix_auth_temp.tsx"
  
  # Usuń linie z document.cookie.split
  grep -v "document\.cookie\.split" "$file" > "$temp_file"
  
  # Usuń linie z if (!token)
  grep -v "if (!token)" "$temp_file" > "${temp_file}_2"
  
  # Usuń linie z Authorization Bearer token
  grep -v "Authorization.*Bearer.*token" "${temp_file}_2" > "${temp_file}_3"
  
  # Usuń puste linie podwójne
  sed '/^[[:space:]]*$/N;/^\s*\n$/d' "${temp_file}_3" > "$file"
  
  # Wyczyść pliki tymczasowe
  rm -f "$temp_file" "${temp_file}_2" "${temp_file}_3"
  
  echo "✅ Naprawiono: $file"
done

echo "🎉 Wszystkie pliki naprawione!"
echo "💡 Pamiętaj aby dodać credentials: 'include' w fetch gdzie potrzeba"
