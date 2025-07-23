// pages/add.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import AddOfferForm from '../components/AddOfferForm'
import styles from '../styles/AddAdvertisement.module.css'

type Theme = 'dark' | 'light' | 'night' | 'natura'

export default function AddAdvertisementPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [user, setUser] = useState<any>(null)
  const [isFirstOffer, setIsFirstOffer] = useState(false)

  // Monitorowanie motywu
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'natura'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  // Pobieranie danych użytkownika
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          // Sprawdź czy to pierwsze ogłoszenie - użyj dedykowanego endpointu
          const offersResponse = await fetch('/api/auth/my-offers')
          const offersData = await offersResponse.json()
          setIsFirstOffer((offersData.offers || []).length === 0)
        }
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error)
      }
    }
    fetchUserData()
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

  const handleSubmit = async (formData: any) => {
    try {
      // Sprawdź czy to publikacja przez system PRO/PRO+
      if (formData.success && formData.action === 'published') {
        // To jest powiadomienie o udanej publikacji z systemu PRO/PRO+
        console.log('✅ Ogłoszenie PRO/PRO+ zostało opublikowane')
        return
      }

      // Sprawdź czy użytkownik ma PRO i nie pokazuj alertu o płatności
      const userHasPro = user?.proType === 'PRO' || user?.proType === 'PRO_PLUS'
      
      console.log('🔍 Sprawdzanie PRO status:', {
        proType: user?.proType,
        userHasPro,
        isFirstOffer,
        userId: user?.id
      })
      
      if (!userHasPro && !isFirstOffer) {
        // Tylko dla użytkowników bez PRO pokazuj alert o płatności
        console.log('❌ Pokazuję alert o płatności - brak PRO i nie pierwsze ogłoszenie')
        alert('⚠️ Wszystkie ogłoszenia wymagają opłacenia przez przyciski płatności w ostatnim kroku. Użyj przycisków "Publikuj za 6 zł" lub "Publikuj + Promuj" aby kontynuować.')
        return
      }
      
      // Dla użytkowników PRO/PRO+ lub pierwszego ogłoszenia - pozwól na publikację bez alertu
      console.log('✅ Użytkownik PRO/PRO+ lub pierwsze ogłoszenie - bez alertu płatności')
      return
      
      // Stary kod zostaje tutaj do ewentualnego przyszłego użycia
      // ale nie będzie wykonywany z powodu return powyżej {
      // Jeśli to płatne ogłoszenie, najpierw przejdź do płatności
      if (formData.fees.total > 0) {
        // Tutaj będzie integracja z systemem płatności
        const paymentConfirmed = window.confirm(`Czy chcesz zapłacić ${formData.fees.total.toFixed(2)} zł za publikację ogłoszenia?`)
        if (!paymentConfirmed) return
      }

      // Przygotowanie danych do wysłania
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price.toString())
      submitData.append('category', formData.category)
      submitData.append('subcategories', JSON.stringify(formData.subcategories))
      submitData.append('location', formData.location)
      submitData.append('contactName', formData.contactName)
      submitData.append('contactEmail', formData.contactEmail)
      submitData.append('contactPhone', formData.contactPhone)
      submitData.append('offerType', formData.offerType)
      submitData.append('wantPromo', formData.wantPromo.toString())
      
      // Dodanie zdjęć
      formData.images.forEach((image: File) => {
        submitData.append('images', image)
      })

      // Wysłanie powiadomienia email do administratora
      await fetch('/api/notifications/new-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          contactEmail: formData.contactEmail,
          price: formData.price
        })
      })

      // Publikacja ogłoszenia
      const response = await fetch('/api/auth/offers/add', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        alert('Ogłoszenie zostało dodane pomyślnie!')
        router.push('/')
      } else {
        const error = await response.json()
        console.error('Błąd odpowiedzi:', error)
        alert(`Błąd: ${error.error || error.message || 'Nieznany błąd'}`)
      }
    } catch (error) {
      console.error('Błąd podczas dodawania ogłoszenia:', error)
      alert('Wystąpił błąd podczas dodawania ogłoszenia')
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* Tło wideo */}
      <div className={styles.bgContainer}>
        {getBackgroundContent()}
        <div className={styles.bgTint} />
      </div>

      {/* Zawartość strony */}
      <div className={styles.content}>
        <div className={styles.backWrapper}>
          <Link href="/" className={styles.backButton}>
            ← Powrót do strony głównej
          </Link>
        </div>

        <AddOfferForm 
          onSubmit={handleSubmit}
          isFirstOffer={isFirstOffer}
          userHasPro={user?.hasPro || false}
          userProType={user?.proType || null}
        />
      </div>
    </div>
  )
}
