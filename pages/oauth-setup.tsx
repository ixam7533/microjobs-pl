import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/OAuth.module.css'

export default function OAuthSetup() {
  const [copied, setCopied] = useState<string | null>(null)
  const [configuring, setConfiguring] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleQuickSetup = async (provider: string) => {
    setConfiguring(provider)
    
    // Demo klucze dla localhost (w prawdziwej aplikacji trzeba by je pobrać od użytkownika)
    const demoKeys = {
      google: {
        clientId: 'demo-google-client-id.apps.googleusercontent.com',
        clientSecret: 'demo-google-client-secret'
      },
      facebook: {
        clientId: '123456789012345',
        clientSecret: 'demo-facebook-client-secret'
      }
    }
    
    const keys = demoKeys[provider as keyof typeof demoKeys]
    
    try {
      const response = await fetch('/api/oauth/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          clientId: keys.clientId,
          clientSecret: keys.clientSecret
        })
      })
      
      if (response.ok) {
        alert(`✅ ${provider} OAuth skonfigurowane!\n\n⚠️ To są demo klucze dla localhost.\n\nZrestartuj serwer aby zobaczyć zmiany.`)
      } else {
        alert('❌ Błąd konfiguracji')
      }
    } catch (error) {
      alert('❌ Błąd połączenia')
    }
    
    setConfiguring(null)
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Konfiguracja OAuth</h1>
          <p className={styles.subtitle}>
            Skonfiguruj logowanie przez Google i Facebook
          </p>

          {/* Szybka konfiguracja demo */}
          <div className={styles.quickSetup}>
            <h2>🚀 Szybka konfiguracja (Demo)</h2>
            <p>Kliknij aby skonfigurować demo klucze OAuth dla localhost:</p>
            <div className={styles.quickButtons}>
              <button 
                onClick={() => handleQuickSetup('google')}
                disabled={configuring === 'google'}
                className={styles.quickBtn}
              >
                {configuring === 'google' ? '⏳ Konfigurowanie...' : '🔧 Skonfiguruj Google'}
              </button>
              <button 
                onClick={() => handleQuickSetup('facebook')}
                disabled={configuring === 'facebook'}
                className={styles.quickBtn}
              >
                {configuring === 'facebook' ? '⏳ Konfigurowanie...' : '🔧 Skonfiguruj Facebook'}
              </button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>lub skonfiguruj ręcznie</span>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Google OAuth</h2>
            <ol className={styles.stepsList}>
              <li>Przejdź do <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>Utwórz nowy projekt lub wybierz istniejący</li>
              <li>Włącz "Google+ API" w sekcji API & Services</li>
              <li>Przejdź do "Credentials" → "Create Credentials" → "OAuth client ID"</li>
              <li>Wybierz "Web application"</li>
              <li>Dodaj autoryzowane redirect URI:</li>
              <div className={styles.codeBlock}>
                <code>http://localhost:3000/api/auth/callback/google</code>
                <button 
                  onClick={() => copyToClipboard('http://localhost:3000/api/auth/callback/google', 'google-uri')}
                  className={styles.copyBtn}
                >
                  {copied === 'google-uri' ? '✓' : '📋'}
                </button>
              </div>
              <li>Skopiuj Client ID i Client Secret</li>
              <li>Dodaj do pliku .env.local:</li>
              <div className={styles.codeBlock}>
                <code>GOOGLE_CLIENT_ID=twoj_client_id<br/>GOOGLE_CLIENT_SECRET=twoj_client_secret</code>
                <button 
                  onClick={() => copyToClipboard('GOOGLE_CLIENT_ID=twoj_client_id\nGOOGLE_CLIENT_SECRET=twoj_client_secret', 'google-env')}
                  className={styles.copyBtn}
                >
                  {copied === 'google-env' ? '✓' : '📋'}
                </button>
              </div>
            </ol>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Facebook OAuth</h2>
            <ol className={styles.stepsList}>
              <li>Przejdź do <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook for Developers</a></li>
              <li>Utwórz nową aplikację</li>
              <li>Dodaj produkt "Facebook Login"</li>
              <li>W ustawieniach Facebook Login dodaj Valid OAuth Redirect URI:</li>
              <div className={styles.codeBlock}>
                <code>http://localhost:3000/api/auth/callback/facebook</code>
                <button 
                  onClick={() => copyToClipboard('http://localhost:3000/api/auth/callback/facebook', 'facebook-uri')}
                  className={styles.copyBtn}
                >
                  {copied === 'facebook-uri' ? '✓' : '📋'}
                </button>
              </div>
              <li>Skopiuj App ID i App Secret z ustawień podstawowych</li>
              <li>Dodaj do pliku .env.local:</li>
              <div className={styles.codeBlock}>
                <code>FACEBOOK_CLIENT_ID=twoj_app_id<br/>FACEBOOK_CLIENT_SECRET=twoj_app_secret</code>
                <button 
                  onClick={() => copyToClipboard('FACEBOOK_CLIENT_ID=twoj_app_id\nFACEBOOK_CLIENT_SECRET=twoj_app_secret', 'facebook-env')}
                  className={styles.copyBtn}
                >
                  {copied === 'facebook-env' ? '✓' : '📋'}
                </button>
              </div>
            </ol>
          </div>

          <div className={styles.warningBox}>
            <h3>⚠️ Ważne informacje</h3>
            <ul>
              <li>Demo klucze działają tylko na localhost</li>
              <li>Dla produkcji potrzebujesz prawdziwych kluczy OAuth</li>
              <li>Po konfiguracji zrestartuj serwer</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <a href="/login" className={styles.backBtn}>
              ← Wróć do logowania
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
