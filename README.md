# MicroJobs.pl - Job Board Platform

Platforma ogłoszeń mikroprac z systemem subskrypcji PRO/PRO+ i integracją płatności Shopify.

## 🚀 Funkcjonalności

- **Ogłoszenia**: Dodawanie, edycja, promowanie ofert pracy
- **Subskrypcje**: PRO (15zł) i PRO+ (25zł) z różnymi benefitami
- **System czatów**: Komunikacja między użytkownikami
- **Oceny**: System reputacji użytkowników
- **Geolokalizacja**: Filtrowanie po lokalizacji
- **OAuth**: Logowanie przez Google i Facebook
- **Płatności**: Integracja z Shopify

## 📋 Wymagania

- Node.js 18+
- PostgreSQL (na produkcji)
- SMTP server do emaili

## 🛠️ Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/yourusername/microjobs.git
cd microjobs

# Instalacja dependencies
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Edytuj .env z własnymi danymi

# Migracje bazy danych
npx prisma migrate dev

# Uruchomienie w trybie dev
npm run dev
```

## 🌐 Deployment na Render

### 1. Ustawienia aplikacji
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js

### 2. Zmienne środowiskowe
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-strong-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app.onrender.com
NODE_ENV=production
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### 3. Baza danych
Dodaj PostgreSQL addon w Render lub użyj zewnętrznej bazy.

## 📁 Struktura projektu

```
├── components/          # React komponenty
├── pages/              # Next.js strony i API routes
├── lib/                # Utilitki i konfiguracje
├── prisma/             # Schema bazy danych
├── public/             # Statyczne pliki
├── styles/             # CSS moduły
└── types/              # TypeScript typy
```

## 🔧 Konfiguracja

### OAuth Setup
1. **Google**: Ustaw przekierowania w Google Console
2. **Facebook**: Skonfiguruj Facebook App
3. **Shopify**: Ustaw webhook i produkty

### Subskrypcje
- **PRO**: 15zł/miesiąc - płatne promocje
- **PRO+**: 25zł/miesiąc - darmowe promocje

## 📝 Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run send-reminders   # Email reminders
npm run cleanup-expired  # Cleanup subscriptions
```

## 🐛 Debugging

Logi są widoczne w trybie development. Na produkcji sprawdź logi w Render dashboard.

## 📄 Licencja

Projekt prywatny - wszelkie prawa zastrzeżone.

## 👥 Wsparcie

W razie problemów, sprawdź:
1. Logi aplikacji
2. Konfigurację zmiennych środowiskowych
3. Status bazy danych
4. Dokumentację Render

---

**Ostatnia aktualizacja**: Styczeń 2025
**Wersja**: 1.0.0
**Status**: Production Ready ✅
