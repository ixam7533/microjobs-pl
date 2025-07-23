// pages/pro.tsx
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import ShopifyButton from '../components/ShopifyButton'
import ShopifyButtonProPlus from '../components/ShopifyButtonProPlus'
import { PRO_VERSIONS } from '../lib/pricing'
import styles from '../styles/Pro.module.css'

type Theme = 'dark' | 'light' | 'night' | 'natura'

export default function ProPage() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')

  const handlePurchaseComplete = () => {
    alert('Subskrypcja została zakupiona pomyślnie!')
    // Redirect to profile with subscription tab
    window.location.href = '/profile?tab=subscription'
  }

  useEffect(() => {
    // Nasłuchuj zmian motywu
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    // Ustaw początkowy motyw
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        return (
          <video
            className={styles.bgVideo}
            src="/chmury.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'dark':
        return (
          <video
            className={styles.bgVideo}
            src="/smoke.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'night':
        return <div className={styles.nightBackground} />
      case 'natura':
        return <div className={styles.naturaBackground} />
      default:
        return (
          <video
            className={styles.bgVideo}
            src="/smoke.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        {/* Dynamiczne tło */}
        <div className={styles.bgContainer}>
          {getBackgroundContent()}
          <div className={styles.bgTint} />
        </div>

        {/* Zawartość strony */}
        <div className={styles.content}>
          <div className={styles.hero}>
            <h1>Wersje PRO</h1>
            <p>Zwiększ swoją widoczność i zyskaj dostęp do zaawansowanych funkcji</p>
          </div>

          <div className={styles.plansGrid}>
            {/* Plan PRO */}
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <h2>Wersja PRO</h2>
                <div className={styles.planPrice}>
                  <span className={styles.price}>{PRO_VERSIONS.PRO.price.toFixed(0)} zł</span>
                  <span className={styles.period}>/ miesiąc</span>
                </div>
              </div>
              
              <div className={styles.planFeatures}>
                {PRO_VERSIONS.PRO.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <ShopifyButton />
            </div>

            {/* Plan PRO+ */}
            <div className={`${styles.planCard} ${styles.featured}`}>
              <div className={styles.featuredBadge}>Polecane</div>
              <div className={styles.planHeader}>
                <h2>Wersja PRO+</h2>
                <div className={styles.planPrice}>
                  <span className={styles.price}>{PRO_VERSIONS.PRO_PLUS.price.toFixed(0)} zł</span>
                  <span className={styles.period}>/ miesiąc</span>
                </div>
              </div>
              
              <div className={styles.planFeatures}>
                {PRO_VERSIONS.PRO_PLUS.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <ShopifyButtonProPlus />
            </div>
          </div>

          <div className={styles.comparison}>
            <h2>Porównanie planów</h2>
            <div className={styles.comparisonTable}>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Nielimitowane ogłoszenia</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Brak reklam</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Priorytetowe wyświetlanie</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Statystyki wyświetleń</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Darmowe promowanie (1/miesiąc)</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>-</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Darmowe promowanie (3/miesiąc)</div>
                <div className={styles.comparisonPro}>✗</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Wyróżnione ramki wokół ogłoszeń</div>
                <div className={styles.comparisonPro}>✗</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
              <div className={styles.comparisonRow}>
                <div className={styles.comparisonFeature}>Wsparcie techniczne</div>
                <div className={styles.comparisonPro}>✓</div>
                <div className={styles.comparisonProPlus}>✓</div>
              </div>
            </div>
          </div>

          <div className={styles.faq}>
            <h2>Często zadawane pytania</h2>
            <div className={styles.faqItem}>
              <h3>Czy mogę anulować subskrypcję w każdej chwili?</h3>
              <p>Tak, możesz anulować subskrypcję w każdej chwili. Dostęp do funkcji PRO będzie aktywny do końca opłaconego okresu.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Czy moje ogłoszenia będą widoczne przez cały miesiąc?</h3>
              <p>Tak, wszystkie ogłoszenia mają ważność 30 dni od daty publikacji, niezależnie od planu.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Co się stanie gdy skończy się plan PRO?</h3>
              <p>Twoje ogłoszenia pozostaną aktywne, ale nowe będą podlegać standardowym opłatom za publikację.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
