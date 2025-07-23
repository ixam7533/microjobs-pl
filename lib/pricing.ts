export const PRICING_TIERS = [
  { min: 0, max: 100, addPrice: 6.00, promoPrice: 4.00 },
  { min: 101, max: 200, addPrice: 6.00, promoPrice: 10.99 },
  { min: 201, max: 1000, addPrice: 6.00, promoPrice: 15.00 },
  { min: 1001, max: Infinity, addPrice: 6.00, promoPrice: 0 } // Brak promocji dla ogłoszeń powyżej 1000zł
]

export const PRO_VERSIONS = {
  PRO: {
    name: 'Wersja PRO',
    price: 15.00,
    features: [
      'Nielimitowane darmowe ogłoszenia',
      'Brak reklam na stronie',
      'Statystyki wyświetleń ogłoszeń',
      'Priorytetowe wsparcie techniczne',
      'Wyróżniony status na profilu'
    ],
    promotions: 3, // 3 darmowe promowania na miesiąc dla PRO
    freePromotions: true
  },
  PRO_PLUS: {
    name: 'Wersja PRO+',
    price: 25.00,
    features: [
      'Wszystko z wersji PRO',
      'Nielimitowane darmowe ogłoszenia',
      'Nieograniczone darmowe promowanie ogłoszeń',
      'Wyróżnione ramki wokół ogłoszeń',
      'Najwyższy priorytet w wynikach wyszukiwania',
      'Dedykowane wsparcie techniczne'
    ],
    promotions: -1, // Nieograniczone darmowe promowania dla PRO+
    freePromotions: true
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
