import { useEffect } from 'react'

interface FacebookSDKProps {
  appId: string
  version?: string
}

export default function FacebookSDK({ appId, version = 'v18.0' }: FacebookSDKProps) {
  useEffect(() => {
    // Sprawdź czy SDK już zostało załadowane
    if (typeof window !== 'undefined' && !window.FB) {
      // Dodaj Facebook SDK script
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/pl_PL/sdk.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      // Konfiguracja Facebook SDK
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: version
        })
        
        // Log page view dla analityki
        window.FB.AppEvents.logPageView()
        
        console.log('Facebook SDK zainicjalizowany')
      }
    }

    return () => {
      // Cleanup nie jest potrzebny dla Facebook SDK
    }
  }, [appId, version])

  return null // Komponent nie renderuje niczego wizualnego
}

// Rozszerzenie typu Window o Facebook SDK
declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}
