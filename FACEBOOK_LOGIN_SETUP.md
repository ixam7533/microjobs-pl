# Konfiguracja Facebook Login dla MicroJobs

## Kroki konfiguracji:

### 1. Konfiguracja Facebook App
1. Przejdź do [Facebook for Developers](https://developers.facebook.com/)
2. Stwórz nową aplikację lub użyj istniejącej
3. Dodaj produkt **Facebook Login**
4. W ustawieniach Facebook Login skonfiguruj:
   - **Valid OAuth Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/facebook` (dla developmentu)
     - `https://microjobs.pl/api/auth/callback/facebook` (dla produkcji)

### 2. Uzyskaj dane OAuth
1. Przejdź do **Ustawienia → Podstawowe** w Twojej Facebook App
2. Skopiuj **App ID** i **App Secret**

### 3. Konfiguracja aplikacji MicroJobs

#### A. Plik .env.local
Zastąp placeholder'y w pliku `.env.local`:

```bash
# OAuth Facebook
FACEBOOK_CLIENT_ID=TWOJE_APP_ID
FACEBOOK_CLIENT_SECRET=TWOJ_APP_SECRET

# Facebook SDK dla frontendu (to samo App ID)
NEXT_PUBLIC_FACEBOOK_APP_ID=TWOJE_APP_ID
```

#### B. Domena produkcyjna
Jeśli używasz domeny `microjobs.pl`, upewnij się że:
1. W Facebook App Settings → Podstawowe → Domeny aplikacji: dodaj `microjobs.pl`
2. W Facebook Login Settings → Valid OAuth Redirect URIs: dodaj `https://microjobs.pl/api/auth/callback/facebook`

### 4. Testowanie

Po konfiguracji:
1. Restart serwera aplikacji
2. Przejdź do strony `/login` lub `/register`
3. Powinieneś zobaczyć działający przycisk "Kontynuuj z Facebook"

### 5. Kod JavaScript Facebook SDK

Aplikacja automatycznie ładuje Facebook SDK z następującą konfiguracją:

```javascript
window.fbAsyncInit = function() {
  FB.init({
    appId: 'TWOJE_APP_ID',
    cookie: true,
    xfbml: true,
    version: 'v18.0'
  });
  FB.AppEvents.logPageView();
};
```

### 6. Rozwiązywanie problemów

#### Błąd "Invalid OAuth access token"
- Sprawdź czy App ID i App Secret są poprawnie skonfigurowane
- Sprawdź czy domena jest dodana w ustawieniach Facebook App

#### Przycisk Facebook nie pojawia się
- Sprawdź konsole deweloperską - czy są błędy JavaScript
- Upewnij się że zmienne środowiskowe są ustawione i aplikacja została zrestartowana

#### Błędy przekierowania
- Sprawdź czy URL przekierowania są dokładnie takie same w Facebook App i konfiguracji NextAuth

### 7. Bezpieczeństwo

⚠️ **Ważne**: 
- Nigdy nie commituj prawdziwych App ID i App Secret do publicznych repozytoriów
- App Secret powinien być bezpieczny i nie ujawniony publicznie
- Dla produkcji użyj zmiennych środowiskowych serwera

---

Po skonfigurowaniu użytkownicy będą mogli logować się przez Facebook zarówno na stronie logowania jak i rejestracji.
