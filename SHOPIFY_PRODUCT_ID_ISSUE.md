# ⚠️ UWAGA - Brakuje Product ID dla promocji 15zł

W trzecim przyciku Shopify (promocja za 15zł) zauważyłem, że użyte jest to samo ID produktu co w drugim przycisku:

```javascript
// DRUGIE (10.99zł) - OK
id: '9716825817430'

// TRZECIE (15zł) - PROBLEM: używa tego samego ID!
id: '9716825817430'  // TO JEST TEN SAM CO WYŻEJ!
```

## Co trzeba zrobić:

1. **Znajdź prawidłowy Product ID** dla promocji 15zł w swoim sklepie Shopify
2. **Zastąp** w pliku `components/ShopifyPromoButton15.tsx` linię:
   ```typescript
   id: '9716825817430', // TO TRZEBA BĘDZIE ZMIENIĆ NA WŁAŚCIWY ID ZA 15ZŁ
   ```
   
   Na prawidłowy ID produktu za 15zł.

## Jak znaleźć Product ID:

1. Idź do Shopify Admin → Products
2. Znajdź produkt "Promocja ogłoszenia za 15zł" 
3. Skopiuj jego ID
4. Zamień w kodzie

## Tymczasowo:

Aplikacja działa, ale przycisk 15zł będzie otwierał produktu za 10.99zł. Po znalezieniu prawidłowego ID wszystko będzie działać poprawnie.

## Struktura cennik promowań:

- **0-100zł** → 4zł (Product ID: `9716825588054`) ✅
- **101-200zł** → 10.99zł (Product ID: `9716825817430`) ✅  
- **201-1000zł** → 15zł (Product ID: `???`) ❌ BRAKUJE
