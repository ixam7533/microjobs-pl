// components/AdSenseAd.tsx
import React, { useEffect, useState } from 'react'
import styles from './AdSenseAd.module.css'
import { AD_CLIENT } from '../lib/adsense-config'

interface AdSenseAdProps {
  adSlot: string
  adFormat?: string
  adStyle?: React.CSSProperties
  type?: 'banner' | 'sidebar' | 'square' | 'offer' | 'bottom'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  type = 'banner',
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Sprawdź czy adsbygoogle jest dostępne
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({})
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error)
        setIsLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${styles.adContainer} ${styles[type]} ${isLoading ? styles.loading : ''} ${className}`}>
      <div className={styles.adLabel}>Reklama</div>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdSenseAd
