# ✅ PRODUCTION READINESS CHECKLIST

## 🚀 Po wrzuceniu strony na internet, sprawdź te rzeczy:

### 1. **Podstawowe funkcjonalności** ✅
- [ ] Strona główna ładuje się poprawnie
- [ ] Menu i nawigacja działają
- [ ] Wszystkie linki działają
- [ ] CSS/Style są poprawne

### 2. **Konfiguracja OAuth - SPRAWDŹ TO PIERWSZĄ RZECZĄ!** 🔧
**Idź na:** `https://twoja-domena.up.railway.app/debug-oauth`

**Co powinieneś zobaczyć:**
- ✅ **NEXTAUTH_SECRET**: SET (zielone)
- ✅ **NEXTAUTH_URL**: twoja dokładna domena (zielone)  
- ✅ **JWT_SECRET**: SET (zielone)
- ✅ **DATABASE_URL**: SET (zielone)

**Jeśli coś jest czerwone - to jest problem do naprawienia!**

### 3. **Test logowania** 🔐

#### A) **Email/Hasło login (powinien działać od razu):**
- [ ] Idź na `/login`
- [ ] Spróbuj zalogować się emailem/hasłem
- [ ] Jeśli nie masz konta, zarejestruj się na `/register`

#### B) **OAuth login (Google/Facebook):**
- [ ] Przyciski "Kontynuuj z Google/Facebook" są widoczne
- [ ] Kliknij i sprawdź czy działa (może wymagać konfiguracji)

### 4. **Test głównych funkcji** ⚙️
- [ ] Dodawanie ogłoszeń (`/add`)
- [ ] Przeglądanie ogłoszeń (strona główna)
- [ ] Profil użytkownika (`/profile`)
- [ ] Subskrypcje PRO/PRO+ (`/pro`)
- [ ] Chat/wiadomości (`/messages`)

### 5. **Test płatności** 💳
- [ ] Sprawdź czy przyciski PRO/PRO+ przekierowują na `/pro`
- [ ] Sprawdź czy Shopify integration działa
- [ ] Test subscribtion flow

### 6. **Bezpieczeństwo** 🛡️
- [ ] HTTPS jest włączone (🔒 w przeglądarce)
- [ ] Nie ma błędów 500 w konsoli przeglądarki
- [ ] Sensitive data nie są exposed

### 7. **Performance** ⚡
- [ ] Strona ładuje się szybko (< 3 sekundy)
- [ ] Obrazy się ładują
- [ ] Brak błędów w Console (F12)

---

## 🔧 Jeśli coś nie działa:

### **Problem: "Błąd sieci" przy logowaniu**
1. Sprawdź `/debug-oauth`
2. Upewnij się że `NEXTAUTH_URL` = dokładna domena Railway
3. Ustaw `NEXTAUTH_SECRET` w Railway

### **Problem: OAuth nie działa (Google/Facebook)**
1. Skonfiguruj redirect URLs w Google/Facebook console
2. Google: `https://twoja-domena/api/auth/callback/google`
3. Facebook: `https://twoja-domena/api/auth/callback/facebook`

### **Problem: Baza danych**
1. Sprawdź czy PostgreSQL jest podłączona w Railway
2. Upewnij się że `DATABASE_URL` jest ustawiona
3. Może trzeba uruchomić migracje: `npx prisma migrate deploy`

### **Problem: 500 Server Error**
1. Sprawdź logi w Railway dashboard
2. Sprawdź czy wszystkie env variables są ustawione
3. Sprawdź czy nie ma błędów w kodzie

---

## 📋 Quick Test Commands:

```bash
# Po deployment, sprawdź te URL-e:
https://twoja-domena/debug-oauth          # OAuth status
https://twoja-domena/api/debug/oauth-status   # JSON oauth info
https://twoja-domena/login                # Login page
https://twoja-domena/register             # Registration
https://twoja-domena/                     # Home page
```

---

## ✅ **SUCCESS CRITERIA:**

**Strona jest gotowa gdy:**
- ✅ `/debug-oauth` pokazuje wszystko na zielono (przynajmniej core config)
- ✅ Email/hasło login działa
- ✅ Można się zarejestrować
- ✅ Strona główna pokazuje ogłoszenia
- ✅ Brak błędów 500

**OAuth można skonfigurować później - email/hasło wystarczy na start!**

---

**PRZEJDŹ PRZEZ TĘ LISTĘ PO DEPLOYMENT I ZAZNACZ CO DZIAŁA!** ✅
