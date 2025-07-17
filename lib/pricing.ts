export const PRICING_TIERS = [
  { min: 0, max: 49, addPrice: 2.50, promoPrice: 5.00 },
  { min: 50, max: 200, addPrice: 6.00, promoPrice: 8.50 },
  { min: 201, max: 300, addPrice: 12.50, promoPrice: 15.00 },
  { min: 301, max: 400, addPrice: 17.50, promoPrice: 20.00 },
  { min: 401, max: 600, addPrice: 22.50, promoPrice: 25.00 },
  { min: 601, max: 1000, addPrice: 30.00, promoPrice: 35.00 },
  { min: 1001, max: Infinity, addPrice: 40.00, promoPrice: 45.00 }
]

export const PRO_VERSIONS = {
  PRO: {
    name: 'Wersja PRO',
    price: 15.00,
    features: [
      'Nielimitowane ogłoszenia',
      'Brak reklam',
      '1 darmowe promowane ogłoszenie/miesiąc',
      'Statystyki wyświetleń',
      'Wsparcie techniczne'
    ],
    promotions: 1
  },
  PRO_PLUS: {
    name: 'Wersja PRO+',
    price: 25.00,
    features: [
      'Wszystko z wersji PRO',
      'Darmowe promowanie 3 ogłoszeń/miesiąc',
      'Wyróżnione ramki',
      'Wsparcie techniczne'
    ],
    promotions: 3
  }
}

export const CATEGORIES = {
  'ogrodnictwo': {
    name: 'Ogrodnictwo',
    subcategories: [
      'Koszenie trawy',
      'Pielęgnacja roślin',
      'Sadzenie kwiatów',
      'Przycinanie drzew',
      'Sprzątanie liści',
      'Nawożenie',
      'Projektowanie ogrodów'
    ]
  },
  'sprzatanie': {
    name: 'Sprzątanie',
    subcategories: [
      'Mycie okien',
      'Odkurzanie',
      'Pranie dywanów',
      'Sprzątanie po remoncie',
      'Generalne sprzątanie',
      'Prasowanie',
      'Mycie elewacji'
    ]
  },
  'transport': {
    name: 'Transport',
    subcategories: [
      'Przeprowadzki',
      'Dostawy',
      'Przewóz osób',
      'Transport mebli',
      'Kurierskie',
      'Przeprowadzki biurowe'
    ]
  },
  'budowlane': {
    name: 'Prace budowlane',
    subcategories: [
      'Malowanie',
      'Układanie płytek',
      'Elektryczne',
      'Hydrauliczne',
      'Tynkowanie',
      'Glazura',
      'Izolacje'
    ]
  },
  'it': {
    name: 'IT i technologie',
    subcategories: [
      'Naprawa komputerów',
      'Instalacja oprogramowania',
      'Projektowanie stron',
      'Pomoc techniczna',
      'Konfiguracja sieci',
      'Odzyskiwanie danych',
      'Szkolenia IT'
    ]
  },
  'opieka': {
    name: 'Opieka',
    subcategories: [
      'Opieka nad dziećmi',
      'Opieka nad zwierzętami',
      'Korepetycje',
      'Tłumaczenia',
      'Fotografowanie',
      'Catering',
      'Masaże',
      'Fryzjerstwo'
    ]
  },
  'inne': {
    name: 'Inne',
    subcategories: [
      'Usługi księgowe',
      'Pomoc prawna',
      'Organizacja imprez',
      'Usługi marketingowe',
      'Konsultacje',
      'Fotografia',
      'Catering',
      'Masaże',
      'Fryzjerstwo',
      'Różne'
    ]
  }
}

export function getPriceForAmount(amount: number) {
  const tier = PRICING_TIERS.find(t => amount >= t.min && amount <= t.max)
  return tier || PRICING_TIERS[PRICING_TIERS.length - 1]
}

export function calculateFees(amount: number, wantPromo: boolean = false) {
  const tier = getPriceForAmount(amount)
  return {
    addPrice: tier.addPrice,
    promoPrice: wantPromo ? tier.promoPrice : 0,
    total: tier.addPrice + (wantPromo ? tier.promoPrice : 0)
  }
}

// Stara funkcja dla kompatybilności
export function calculateCost(price: number): number {
  return getPriceForAmount(price).addPrice
}
