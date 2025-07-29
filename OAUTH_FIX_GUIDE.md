# 🚨 FIX OAuth Login Error - "Błąd sieci, spróbuj ponownie"

## Problem
Strona działa na produkcji, ale logowanie przez Google/Facebook nie działa i pokazuje błąd sieci.

## 🔍 Prawdopodobne przyczyny:

### 1. **Brakujące zmienne środowiskowe na Railway**
```env
NEXTAUTH_SECRET=your-strong-secret-here
NEXTAUTH_URL=https://your-app.up.railway.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id  
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
JWT_SECRET=your-jwt-secret
```

### 2. **Google OAuth nie skonfigurowany dla domeny produkcyjnej**
- W Google Cloud Console
- Authorized JavaScript origins: `https://your-app.up.railway.app`
- Authorized redirect URIs: `https://your-app.up.railway.app/api/auth/callback/google`

### 3. **Facebook OAuth nie skonfigurowany**
- W Facebook App Settings
- Valid OAuth Redirect URIs: `https://your-app.up.railway.app/api/auth/callback/facebook`

## 🛠️ Rozwiązanie krok po kroku:

### Krok 1: Sprawdź zmienne środowiskowe
Otwórz w przeglądarce: `https://your-app.up.railway.app/api/debug/oauth-status`

Powinno pokazać wszystko jako "SET", nie "NOT_SET"

### Krok 2: Google OAuth Setup
1. Idź do [Google Cloud Console](https://console.cloud.google.com)
2. Credentials → OAuth 2.0 Client IDs
3. Dodaj do **Authorized JavaScript origins**:
   ```
   https://your-app.up.railway.app
   ```
4. Dodaj do **Authorized redirect URIs**:
   ```
   https://your-app.up.railway.app/api/auth/callback/google
   ```

### Krok 3: Facebook OAuth Setup  
1. Idź do [Facebook Developers](https://developers.facebook.com)
2. Your App → Facebook Login → Settings
3. Dodaj do **Valid OAuth Redirect URIs**:
   ```
   https://your-app.up.railway.app/api/auth/callback/facebook
   ```

### Krok 4: Railway Environment Variables
W Railway dashboard ustaw:
```env
NODE_ENV=production
NEXTAUTH_SECRET=generate-strong-random-string-here
NEXTAUTH_URL=https://your-exact-railway-domain.up.railway.app
GOOGLE_CLIENT_ID=your-google-client-id-from-cloud-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-cloud-console
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
JWT_SECRET=another-strong-random-string
DATABASE_URL=your-postgresql-connection-string
```

### Krok 5: Restart aplikacji
Po ustawieniu zmiennych, restart deployment w Railway.

## 🧪 Testowanie:

1. **Debug endpoint**: `/api/debug/oauth-status` - sprawdź czy wszystkie zmienne są "SET"
2. **Logowanie lokalne**: Email/hasło powinno działać od razu
3. **OAuth**: Google/Facebook po konfiguracji powyżej

## ⚡ Szybka naprawa:

Jeśli chcesz **tylko lokalny login** (email/hasło), dodaj tylko:
```env
NEXTAUTH_SECRET=any-random-string-here
JWT_SECRET=another-random-string
DATABASE_URL=your-db-url
```

OAuth możesz skonfigurować później.

## 🎯 Najczęstszy problem:
**NEXTAUTH_URL** musi być **dokładnie** taka sama jak domena aplikacji na Railway!

Sprawdź w Railway settings jaka jest dokładna domena i użyj jej w NEXTAUTH_URL.
