import React, { useState, useEffect } from 'react'
import styles from './AuthLayout.module.css'

type Theme = 'dark' | 'light' | 'night'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Nasłuchuj zmian motywu
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    // Ustaw początkowy motyw
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        // Jasny motyw - piękny gradient błękit → granat
        return <div className={styles.lightBackground} />
      case 'dark':
        return (
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src="/smoke.mp4" type="video/mp4" />
          </video>
        )
      case 'night':
        return <div className={styles.nightBackground} />
      default:
        return (
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src="/smoke.mp4" type="video/mp4" />
          </video>
        )
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* 1. animowane tło */}
      <div className={styles.overlay}>
        {getBackgroundContent()}
        <div className={styles.tint} />
      </div>

      {/* 2. falowana granica na dole */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path
            d="M0,20 C120,40 240,0 360,20 C480,40 600,0 720,20 C840,40 960,0 1080,20 C1200,40 1320,0 1440,20 L1440,40 L0,40 Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>

      {/* 3. kontener na formularz */}
      <div className={styles.formContainer}>
        {children}
      </div>
    </div>
  )
}
