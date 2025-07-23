# 🚀 Nowe przyciski promocji Shopify - Instrukcja

## ✅ Co zostało zaimplementowane:

### 1. Nowe komponenty:
- **`ShopifyPromoButton4.tsx`** - promocja za 4zł (ogłoszenia 0-100zł)
- **`ShopifyPromoButton10.tsx`** - promocja za 10.99zł (ogłoszenia 101-200zł)  
- **`ShopifyPromoButton15.tsx`** - promocja za 15zł (ogłoszenia 201-1000zł)
- **`SmartShopifyPromoButton.tsx`** - inteligentny wybór przycisku

### 2. Logika działania:

#### Dla użytkowników PRO/PRO+:
- **PRO+** → **"🚀 Promuj za DARMO"** (nieograniczone)
- **PRO** → **"🚀 Promuj za DARMO (X pozostało)"** (ograniczone)

#### Dla użytkowników bez PRO lub gdy się skończy limit:
- **0-100zł** → Shopify przycisk "🚀 Promuj za 4zł"
- **101-200zł** → Shopify przycisk "🚀 Promuj za 10.99zł"  
- **201-1000zł** → Shopify przycisk "🚀 Promuj za 15zł"
- **Powyżej 1000zł** → "Brak promocji dla tej ceny"

### 3. Lokalizacja:
Przyciski są widoczne w sekcji **"Moje ogłoszenia"** w profilu użytkownika, obok przycisków "Edytuj" i "Usuń".

---

## 🧪 Jak testować:

### Test 1: Użytkownik bez PRO
1. Zaloguj się na konto bez subskrypcji PRO
2. Przejdź do **Profil → Moje ogłoszenia** 
3. Powinny być widoczne przyciski Shopify na podstawie ceny:
   - Ogłoszenie za 50zł → "🚀 Promuj za 4zł"
   - Ogłoszenie za 150zł → "🚀 Promuj za 10.99zł"
   - Ogłoszenie za 500zł → "🚀 Promuj za 15zł"

### Test 2: Użytkownik PRO+
1. Zaloguj się na konto PRO+
2. Przejdź do **Profil → Moje ogłoszenia**
3. Wszystkie ogłoszenia powinny mieć: **"🚀 Promuj za DARMO"**

### Test 3: Użytkownik PRO z limitami
1. Zaloguj się na konto PRO
2. Powinno być: **"🚀 Promuj za DARMO (X pozostało)"**
3. Po wykorzystaniu limitów → przełączenie na przyciski Shopify

---

## ⚠️ Znane problemy:

### Problem z Product ID dla 15zł:
Przycisk 15zł używa tego samego Product ID co przycisk 10.99zł. Trzeba:
1. Znaleźć prawidłowy Product ID w Shopify
2. Zastąpić w `ShopifyPromoButton15.tsx`

---

## 🎨 Wygląd przycisków:

### Darmowe promocje:
- **Kolor:** Pomarańczowy (#ff6b35)
- **Tekst:** Biały, pogrubiony
- **Rozmiar:** Kompaktowy (8px padding)

### Shopify przyciski:
- **Kolor:** Zielony (#0e9e50)
- **Tekst:** Biały, pogrubiony  
- **Rozmiar:** Kompaktowy (dostosowany)

---

## 🔧 Konfiguracja:

Wszystko działa automatycznie na podstawie:
- **Typ subskrypcji** użytkownika
- **Ceny ogłoszenia**
- **Pozostałe darmowe promocje**

Nie ma potrzeby dodatkowej konfiguracji! 🎉
