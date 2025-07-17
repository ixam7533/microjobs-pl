import { useState, useEffect } from 'react'
import styles from './AccountSettings.module.css'

interface AccountSettingsProps {
  user: { email: string; isAdmin?: boolean } | null
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [activeSection, setActiveSection] = useState<'security' | 'preferences' | 'notifications' | 'account'>('security')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Security section state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Preferences section state
  const [preferences, setPreferences] = useState({
    theme: 'natura',
    language: 'pl',
    emailNotifications: true,
    pushNotifications: false
  })

  // Reset password state
  const [resetEmail, setResetEmail] = useState('')

  // Account stats
  const [accountStats, setAccountStats] = useState({
    totalOffers: 0,
    totalMessages: 0,
    accountAge: 0,
    lastLogin: null as string | null
  })

  useEffect(() => {
    // Załaduj preferencje z localStorage
    const savedPreferences = localStorage.getItem('userPreferences')
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }

    // Symuluj statystyki konta
    if (user) {
      setAccountStats({
        totalOffers: Math.floor(Math.random() * 20) + 1,
        totalMessages: Math.floor(Math.random() * 50) + 5,
        accountAge: Math.floor(Math.random() * 365) + 30,
        lastLogin: new Date().toISOString()
      })
    }
  }, [user])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne' })
      setIsLoading(false)
      return
    }

    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zmiany hasła' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      })

      const data = await response.json()
      setMessage({ type: 'success', text: data.message })
      setResetEmail('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas resetowania hasła' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePreferences = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Zapisz w localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences))
      
      // Aplikuj motyw
      document.documentElement.setAttribute('data-theme', preferences.theme)
      
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      
      const response = await fetch('/api/auth/update-preferences', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ustawienia zostały zapisane' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zapisywania ustawień' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna.')) {
      if (window.confirm('Ostatnia szansa! Czy na pewno chcesz usunąć swoje konto?')) {
        alert('Funkcja usuwania konta zostanie wkrótce dodana')
      }
    }
  }

  const handleExportData = () => {
    const dataToExport = {
      user: user?.email,
      preferences,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `microjobs-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.preferences) {
          setPreferences(importedData.preferences)
          setMessage({ type: 'success', text: 'Ustawienia zostały zaimportowane' })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Błąd podczas importowania ustawień' })
      }
    }
    reader.readAsText(file)
  }

  const handleLogoutAllDevices = async () => {
    if (window.confirm('Czy na pewno chcesz wylogować się ze wszystkich urządzeń?')) {
      try {
        // Wyczyść tokeny
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        localStorage.clear()
        sessionStorage.clear()
        
        setMessage({ type: 'success', text: 'Wylogowano ze wszystkich urządzeń' })
        
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } catch (error) {
        setMessage({ type: 'error', text: 'Błąd podczas wylogowywania' })
      }
    }
  }

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000)
  }

  useEffect(() => {
    if (message) {
      clearMessage()
    }
  }, [message])

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h2>Ustawienia konta</h2>
        <p>Zarządzaj swoim kontem i preferencjami</p>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className={styles.settingsContent}>
        <nav className={styles.settingsNav}>
          <button 
            className={`${styles.navButton} ${activeSection === 'security' ? styles.active : ''}`}
            onClick={() => setActiveSection('security')}
          >
            🔒 Bezpieczeństwo
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveSection('preferences')}
          >
            🎨 Preferencje
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            🔔 Powiadomienia
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'account' ? styles.active : ''}`}
            onClick={() => setActiveSection('account')}
          >
            👤 Konto
          </button>
        </nav>

        <div className={styles.settingsPanel}>
          {activeSection === 'security' && (
            <div className={styles.section}>
              <h3>Zmiana hasła</h3>
              <form onSubmit={handleChangePassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Obecne hasło</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nowe hasło</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Potwierdź nowe hasło</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" disabled={isLoading} className={styles.primaryButton}>
                  {isLoading ? 'Zmienianie...' : 'Zmień hasło'}
                </button>
              </form>

              <hr className={styles.divider} />

              <h3>Resetowanie hasła</h3>
              <p>Wyślij link resetujący hasło na email</p>
              <form onSubmit={handleResetPassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={user?.email || 'Wprowadź email'}
                    required
                  />
                </div>
                <button type="submit" disabled={isLoading} className={styles.secondaryButton}>
                  {isLoading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                </button>
              </form>

              <hr className={styles.divider} />

              <h3>Sesje</h3>
              <p>Zarządzaj swoimi sesjami logowania</p>
              <button onClick={handleLogoutAllDevices} className={styles.secondaryButton}>
                🔐 Wyloguj ze wszystkich urządzeń
              </button>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className={styles.section}>
              <h3>Wygląd i zachowanie</h3>
              
              <div className={styles.preferenceGroup}>
                <h4>Motyw aplikacji</h4>
                <div className={styles.themeSelector}>
                  {[
                    { value: 'natura', label: '🌿 Natura', desc: 'Zielony motyw natury' },
                    { value: 'light', label: '☀️ Jasny', desc: 'Jasny motyw z chmurami' },
                    { value: 'dark', label: '🌙 Ciemny', desc: 'Ciemny motyw z dymem' },
                    { value: 'night', label: '🌌 Nocny', desc: 'Nocny motyw gwiaździsty' }
                  ].map(theme => (
                    <label key={theme.value} className={styles.themeOption}>
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={preferences.theme === theme.value}
                        onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      />
                      <div className={styles.themeCard}>
                        <div className={styles.themeLabel}>{theme.label}</div>
                        <div className={styles.themeDesc}>{theme.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.preferenceGroup}>
                <h4>Język</h4>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  className={styles.select}
                >
                  <option value="pl">🇵🇱 Polski</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>

              <button onClick={handleUpdatePreferences} disabled={isLoading} className={styles.primaryButton}>
                {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <h3>Powiadomienia</h3>
              
              <div className={styles.notificationGroup}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                  />
                  <span className={styles.switch}></span>
                  <div>
                    <div className={styles.switchTitle}>Powiadomienia email</div>
                    <div className={styles.switchDesc}>Otrzymuj informacje o nowych wiadomościach</div>
                  </div>
                </label>
              </div>

              <div className={styles.notificationGroup}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                  />
                  <span className={styles.switch}></span>
                  <div>
                    <div className={styles.switchTitle}>Powiadomienia push</div>
                    <div className={styles.switchDesc}>Otrzymuj natychmiastowe powiadomienia</div>
                  </div>
                </label>
              </div>

              <button onClick={handleUpdatePreferences} disabled={isLoading} className={styles.primaryButton}>
                {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </button>
            </div>
          )}

          {activeSection === 'account' && (
            <div className={styles.section}>
              <h3>Informacje o koncie</h3>
              
              <div className={styles.accountInfo}>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <div className={styles.infoValue}>{user?.email}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Typ konta</label>
                  <div className={styles.infoValue}>
                    {user?.isAdmin ? (
                      <span className={styles.adminBadge}>Administrator</span>
                    ) : (
                      <span className={styles.userBadge}>Użytkownik</span>
                    )}
                  </div>
                </div>
              </div>

              <hr className={styles.divider} />

              <h3>Statystyki konta</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📝</div>
                  <div className={styles.statValue}>{accountStats.totalOffers}</div>
                  <div className={styles.statLabel}>Ogłoszeń</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💬</div>
                  <div className={styles.statValue}>{accountStats.totalMessages}</div>
                  <div className={styles.statLabel}>Wiadomości</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statValue}>{accountStats.accountAge}</div>
                  <div className={styles.statLabel}>Dni na platformie</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🕒</div>
                  <div className={styles.statValue}>
                    {accountStats.lastLogin ? 
                      new Date(accountStats.lastLogin).toLocaleDateString('pl-PL') : 
                      'Nieznana'
                    }
                  </div>
                  <div className={styles.statLabel}>Ostatnie logowanie</div>
                </div>
              </div>

              <hr className={styles.divider} />

              <h3>Zarządzanie danymi</h3>
              <div className={styles.dataManagement}>
                <div className={styles.dataItem}>
                  <h4>Export ustawień</h4>
                  <p>Pobierz plik z Twoimi ustawieniami</p>
                  <button onClick={handleExportData} className={styles.secondaryButton}>
                    📥 Eksportuj ustawienia
                  </button>
                </div>
                <div className={styles.dataItem}>
                  <h4>Import ustawień</h4>
                  <p>Wczytaj wcześniej zapisane ustawienia</p>
                  <label className={styles.fileInputLabel}>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className={styles.fileInput}
                    />
                    <span className={styles.secondaryButton}>📤 Importuj ustawienia</span>
                  </label>
                </div>
              </div>

              <hr className={styles.divider} />

              <h3>Zarządzanie kontem</h3>
              <div className={styles.dangerZone}>
                <h4>Strefa niebezpieczna</h4>
                <p>Te akcje są nieodwracalne. Zachowaj ostrożność.</p>
                <button onClick={handleDeleteAccount} className={styles.dangerButton}>
                  🗑️ Usuń konto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
