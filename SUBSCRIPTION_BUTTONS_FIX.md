# ✅ NAPRAWIONO: Przyciski Kup PRO przekierowują do /pro

## 🎯 Problem:
Przyciski "Kup PRO (15 zł)" i "Kup PRO+ (25 zł)" w sekcji "Subskrypcje" w profilu użytkownika od razu kupowały subskrypcję zamiast przekierowywać do strony `/pro` z opisami planów.

## 🔧 Rozwiązanie:
Zmieniono funkcjonalność przycisków w `components/SubscriptionManager.tsx`:

### ❌ PRZED (linie 195-207):
```tsx
<button 
  onClick={() => handlePurchase('PRO')}
  disabled={purchasing}
  className={`${styles.purchaseButton} ${styles.proButton}`}
>
  {purchasing ? 'Przetwarzanie...' : 'Kup PRO (15 zł)'}
</button>
<button 
  onClick={() => handlePurchase('PRO_PLUS')}
  disabled={purchasing}
  className={`${styles.purchaseButton} ${styles.proPlusButton}`}
>
  {purchasing ? 'Przetwarzanie...' : 'Kup PRO+ (25 zł)'}
</button>
```

### ✅ PO (linie 195-207):
```tsx
<button 
  onClick={() => window.location.href = '/pro'}
  disabled={purchasing}
  className={`${styles.purchaseButton} ${styles.proButton}`}
>
  Kup PRO (15 zł)
</button>
<button 
  onClick={() => window.location.href = '/pro'}
  disabled={purchasing}
  className={`${styles.purchaseButton} ${styles.proPlusButton}`}
>
  Kup PRO+ (25 zł)
</button>
```

## 🗑️ Czyszczenie kodu:
- Usunięto nieużywaną funkcję `handlePurchase()`
- Uproszczono wyświetlanie tekstu przycisków (bez stanu "Przetwarzanie...")
- Funkcja `handleCancel()` została zachowana dla anulowania subskrypcji

## 🎯 Rezultat:
✅ Oba przyciski ("Kup PRO" i "Kup PRO+") w sekcji Subskrypcje przekierowują do `/pro`  
✅ Użytkownik widzi pełne opisy planów przed dokonaniem zakupu  
✅ Złoty przycisk PRO w nagłówku pozostaje niezmieniony  
✅ Funkcjonalność anulowania subskrypcji działa poprawnie  

## 📍 Gdzie znajdziesz tę zmianę:
- **Plik**: `components/SubscriptionManager.tsx`
- **Sekcja**: Profil → Subskrypcje
- **Przypadek użycia**: Użytkownicy z anulowaną subskrypcją lub bez subskrypcji

## 🧪 Test:
1. Przejdź do `/profile`
2. Kliknij zakładkę "Subskrypcje"  
3. Kliknij "Kup PRO (15 zł)" lub "Kup PRO+ (25 zł)"
4. ✅ Zostaniesz przekierowany do `/pro` zamiast od razu kupować

---
**Status**: ✅ **NAPRAWIONE I PRZETESTOWANE**
