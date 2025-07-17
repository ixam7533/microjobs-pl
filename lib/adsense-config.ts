// lib/adsense-config.ts
export const AD_SLOTS = {
  // Główny banner na stronie głównej
  banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || '1234567890',
  
  // Sidebar na stronie głównej
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || '0987654321',
  
  // Kwadratowa reklama
  square: process.env.NEXT_PUBLIC_ADSENSE_SQUARE_SLOT || '1122334455',
  
  // Reklama w ofercie
  offer: process.env.NEXT_PUBLIC_ADSENSE_OFFER_SLOT || '5566778899',
  
  // Reklama na końcu listy
  bottom: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || '9988776655'
}

export const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3508998956815296'
