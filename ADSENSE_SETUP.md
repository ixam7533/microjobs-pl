# 🎯 Instrukcja konfiguracji Google AdSense

## 📝 Krok 1: Utwórz sloty reklamowe w Google AdSense

Zaloguj się do [Google AdSense](https://www.google.com/adsense/) i utwórz następujące sloty reklamowe:

### 1. Banner główny (728x90 lub responsive)
- **Nazwa**: "MicroJobs - Banner główny"
- **Typ**: Banner
- **Rozmiar**: 728x90 lub Responsive
- **Lokalizacja**: Strona główna - nad listą ofert

### 2. Sidebar (300x250 lub responsive)  
- **Nazwa**: "MicroJobs - Sidebar"
- **Typ**: Rectangular
- **Rozmiar**: 300x250 lub Responsive
- **Lokalizacja**: Strona główna - prawa kolumna

### 3. Kwadratowa reklama (300x250)
- **Nazwa**: "MicroJobs - Kwadrat w oferach"
- **Typ**: Rectangular  
- **Rozmiar**: 300x250
- **Lokalizacja**: Między ofertami (co 6 ogłoszeń)

### 4. Reklama w ofercie (468x60)
- **Nazwa**: "MicroJobs - W ofercie"
- **Typ**: Banner
- **Rozmiar**: 468x60 lub Responsive
- **Lokalizacja**: Modal z ofertą

### 5. Reklama na dole (970x90)
- **Nazwa**: "MicroJobs - Dół listy"
- **Typ**: Leaderboard
- **Rozmiar**: 970x90 lub Responsive
- **Lokalizacja**: Na końcu listy ofert

## 🔧 Krok 2: Zaktualizuj konfigurację

Po utworzeniu slotów w AdSense, zaktualizuj plik `.env.local`:

\`\`\`bash
# AdSense Configuration
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-3508998956815296
NEXT_PUBLIC_ADSENSE_BANNER_SLOT=TWÓJ_SLOT_BANNER
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=TWÓJ_SLOT_SIDEBAR
NEXT_PUBLIC_ADSENSE_SQUARE_SLOT=TWÓJ_SLOT_KWADRAT
NEXT_PUBLIC_ADSENSE_OFFER_SLOT=TWÓJ_SLOT_OFERTA
NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT=TWÓJ_SLOT_DÓŁ
\`\`\`

## 📍 Krok 3: Rozmieszczenie reklam

Reklamy są już zaimplementowane w następujących miejscach:

### Strona główna (`pages/index.tsx`):
- ✅ **Banner** - nad przyciskami filtrowania
- ✅ **Sidebar** - prawa kolumna

### Sekcja ofert (`components/OffersSection.tsx`):
- ✅ **Kwadratowa reklama** - co 6 ogłoszeń
- ✅ **Reklama na dole** - na końcu listy

### Modal oferty (`components/OfferModal.tsx`):
- ✅ **Reklama w ofercie** - między opisem a akcjami

## 💎 Krok 4: System PRO - ukrywanie reklam

Reklamy są automatycznie ukrywane dla użytkowników z aktywną subskrypcją PRO/PRO+:

- **Sprawdzanie subskrypcji** - komponent `AdBlocker` 
- **API endpoint** - `/api/subscriptions/status`
- **Automatyczne ukrywanie** - wszystkie reklamy znikają dla użytkowników PRO

## 🎨 Krok 5: Personalizacja stylów

Możesz dostosować wygląd reklam w:
- `components/AdSenseAd.module.css` - główne style
- `components/OffersSection.module.css` - reklamy w oferach
- `components/OfferModal.module.css` - reklamy w modalu

## ⚠️ Ważne uwagi:

1. **Weryfikacja domeny** - AdSense wymaga weryfikacji domeny
2. **Polityka treści** - sprawdź czy strona spełnia wymagania AdSense
3. **Testowanie** - używaj trybu testowego podczas rozwoju
4. **Responsive design** - reklamy automatycznie dostosowują się do ekranu
5. **Wydajność** - reklamy ładują się asynchronicznie

## 🚀 Uruchomienie:

\`\`\`bash
npm run dev
\`\`\`

Reklamy będą widoczne dla niezalogowanych użytkowników i użytkowników bez subskrypcji PRO.

## 📊 Monitorowanie:

- **Google AdSense dashboard** - statystyki i zarobki
- **AdSense reports** - analiza wydajności
- **A/B testing** - testuj różne rozmiary i pozycje
