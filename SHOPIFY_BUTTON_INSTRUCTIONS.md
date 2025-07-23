# Instrukcja dodania przycisku PRO+ w Shopify

## Co zostało zrobione:
✅ Utworzony komponent `ShopifyButton.tsx` - uniwersalny komponent dla przycisków Shopify
✅ Utworzony komponent `ShopifyButtonProPlus.tsx` - dedykowany komponent dla PRO+
✅ Zastąpiony przycisk PRO w `pages/pro.tsx` - teraz używa automatycznego przycisku Shopify z tekstem "Wybieram PRO"
✅ Dodany przycisk PRO+ z tekstem "Wybieram PRO+"
✅ Wycentrowane przyciski w obu wersjach
✅ Zmienione teksty z "Out of stock" na właściwe nazwy przycisków

## Co musisz zrobić gdy będziesz miał właściwy produkt PRO+ w Shopify:

### 1. W Shopify Admin:
- Stwórz produkt PRO+ (jeśli jeszcze nie masz)
- Skopiuj ID produktu PRO+ z URL produktu

### 2. W kodzie:
W pliku `components/ShopifyButtonProPlus.tsx` zmień linię 35:

Z:
```tsx
id: '9713980014934', // Tymczasowo ten sam ID co PRO - zmień na właściwy dla PRO+
```

Na:
```tsx
id: 'TUTAJ_ID_PRODUKTU_PRO_PLUS',
```

### 3. Przykład:
Jeśli ID produktu PRO+ to np. "9713980014935", to zmień na:

```tsx
id: '9713980014935',
```

## Korzyści z tej zmiany:
✅ Automatyczne płatności przez Shopify
✅ Bezpieczne przetwarzanie kart  
✅ Automatyczne faktury i zarządzanie subskrypcjami
✅ Jednolity wygląd przycisków
✅ Wycentrowane przyciski
✅ Właściwe nazwy przycisków ("Wybieram PRO" / "Wybieram PRO+")
✅ Łatwość dodawania nowych produktów
✅ Obsługa stanów "out of stock" z właściwymi tekstami

## Uwagi:
- Komponent ShopifyButton automatycznie ładuje skrypty Shopify
- Wszystkie style są dopasowane do designu strony  
- Przycisk PRO już działa z produktem o ID: 9713980014934
- Przycisk PRO+ tymczasowo używa tego samego ID - zmień gdy będziesz miał właściwy produkt
- Oba przyciski są wycentrowane i mają spójny design
