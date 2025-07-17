// pages/index.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import OffersSection, { Offer } from '../components/OffersSection'
import Pagination from '../components/Pagination'
import MainFooter from '../components/MainFooter'
import { Advertisement } from '../components/AdBlocker'
import { wojewodztwa, getMiastaForWojewodztwo, wojewodztwoMiasta } from '../lib/locations'
import styles from '../styles/Home.module.css'

type Theme = 'dark' | 'light' | 'night' | 'natura'

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ApiResponse {
  offers: Offer[]
  pagination: PaginationData
}

const kategorie: Record<string, string[]> = {
  'ogrodnictwo': [
    'Koszenie trawy',
    'Pielęgnacja roślin',
    'Sadzenie kwiatów',
    'Przycinanie żywopłotów',
    'Odchwaszczanie',
    'Grabienie liści',
    'Nawadnianie',
    'Projektowanie ogrodów'
  ],
  'sprzątanie': [
    'Mycie okien',
    'Odkurzanie',
    'Pranie',
    'Sprzątanie domu',
    'Sprzątanie biura',
    'Sprzątanie po remoncie',
    'Czyszczenie dywanów',
    'Mycie samochodu'
  ],
  'transport': [
    'Przeprowadzki',
    'Dostawy',
    'Przewóz osób',
    'Przewóz mebli',
    'Kurierskie',
    'Pomoc przy zakupach',
    'Transport zwierząt'
  ],
  'budowlane': [
    'Malowanie',
    'Układanie płytek',
    'Montaż mebli',
    'Drobne naprawy',
    'Gipsy i szpachlowanie',
    'Instalacje elektryczne',
    'Instalacje hydrauliczne',
    'Renowacja'
  ],
  'it': [
    'Naprawa komputerów',
    'Instalacja oprogramowania',
    'Projektowanie stron',
    'Pomoc techniczna',
    'Konfiguracja sieci',
    'Odzyskiwanie danych',
    'Szkolenia IT'
  ],
  'opieka': [
    'Opieka nad dziećmi',
    'Opieka nad zwierzętami',
    'Korepetycje',
    'Tłumaczenia',
    'Fotografowanie',
    'Catering',
    'Masaże',
    'Fryzjerstwo'
  ],
  'inne': [
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

export default function Home() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [currentTheme, setCurrentTheme] = useState<Theme>('natura')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [province, setProvince] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [radius, setRadius] = useState<string>('')
  const [mainCat, setMainCat] = useState<string>('')
  const [subCat, setSubCat] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [offerType, setOfferType] = useState<string>('')

  // Obsługa parametru category z URL
  useEffect(() => {
    if (router.query.category && typeof router.query.category === 'string') {
      setMainCat(router.query.category)
    }
  }, [router.query.category])

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

  useEffect(() => {
    const params = new URLSearchParams()
    if (maxPrice)  params.append('maxPrice', maxPrice)
    if (minPrice)  params.append('minPrice', minPrice)
    if (province)  params.append('province', province)
    if (city)      params.append('city', city)
    if (radius)    params.append('radius', radius)
    if (mainCat)   params.append('mainCat', mainCat)
    if (subCat)    params.append('subCat', subCat)
    if (sortBy)    params.append('sortBy', sortBy)
    if (searchTerm) params.append('search', searchTerm)
    if (offerType) params.append('offerType', offerType)
    params.append('page', currentPage.toString())
    params.append('limit', '12')

    fetch('/api/offers?' + params.toString())
      .then(res => res.json())
      .then((data: ApiResponse) => {
        setOffers(data.offers || [])
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false
        })
      })
      .catch(() => {
        setOffers([])
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false
        })
      })
  }, [maxPrice, minPrice, province, city, radius, mainCat, subCat, sortBy, searchTerm, currentPage, offerType])

  // Reset do pierwszej strony gdy zmieniają się filtry
  useEffect(() => {
    setCurrentPage(1)
  }, [maxPrice, minPrice, province, city, radius, mainCat, subCat, sortBy, searchTerm, offerType])

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        // Jasny motyw - video chmury.mp4
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
  
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'ogrodnictwo': 'Dom i ogród',
      'sprzątanie': 'Sprzątanie',
      'transport': 'Transport i logistyka',
      'budowlane': 'Budowlane i remontowe',
      'IT': 'IT i technologie',
      'usługi': 'Usługi osobiste',
      'inne': 'Inne'
    }
    return categoryMap[category] || category
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* full‐screen video background */}
        <div className={styles.bgContainer}>
          {getBackgroundContent()}
          <div className={styles.bgTint} />
        </div>

        {/* edge‐to‐edge three‐column layout */}
        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <h3>Filtry</h3>
            
            {/* Wyszukiwarka */}
            <div className={styles.filterGroup}>
              <label>
                <span>🔍 Wyszukaj:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Wpisz czego szukasz..."
                />
              </label>
            </div>

            {/* Sortowanie */}
            <div className={styles.filterGroup}>
              <label>
                <span>📊 Sortuj:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Najnowsze</option>
                  <option value="oldest">Najstarsze</option>
                  <option value="price_low">Cena rosnąco</option>
                  <option value="price_high">Cena malejąco</option>
                  <option value="title">Alfabetycznie</option>
                </select>
              </label>
            </div>

            {/* Cena */}
            <div className={styles.filterGroup}>
              <h4>💰 Cena</h4>
              <div className={styles.priceRange}>
                <label>
                  <span>Od:</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="0"
                  />
                </label>
                <label>
                  <span>Do:</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="1000"
                  />
                </label>
              </div>
            </div>

            {/* Lokalizacja */}
            <div className={styles.filterGroup}>
              <h4>📍 Lokalizacja</h4>
              <label>
                <span>Województwo:</span>
                <select
                  value={province}
                  onChange={e => {
                    setProvince(e.target.value)
                    setCity('') // Resetuj miasto przy zmianie województwa
                  }}
                >
                  <option value="">Wszystkie</option>
                  {wojewodztwa && wojewodztwa.map(w => (
                    <option key={w} value={w}>
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Miasto:</span>
                {province ? (
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  >
                    <option value="">Wszystkie miasta</option>
                    {getMiastaForWojewodztwo(province).map(miasto => (
                      <option key={miasto} value={miasto}>
                        {miasto}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="np. Warszawa lub wybierz województwo"
                  />
                )}
              </label>

              <label>
                <span>Promień (km):</span>
                <input
                  type="number"
                  value={radius}
                  onChange={e => setRadius(e.target.value)}
                  placeholder="10"
                />
              </label>
            </div>

            {/* Kategoria */}
            <div className={styles.filterGroup}>
              <h4>📂 Kategoria</h4>
              <label>
                <span>Kategoria główna:</span>
                <select
                  value={mainCat}
                  onChange={e => {
                    setMainCat(e.target.value)
                    setSubCat('')
                  }}
                >
                  <option value="">Wszystkie</option>
                  {Object.keys(kategorie).map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryDisplayName(cat)}
                    </option>
                  ))}
                </select>
              </label>

              {mainCat && (
                <label>
                  <span>Podkategoria:</span>
                  <select
                    value={subCat}
                    onChange={e => setSubCat(e.target.value)}
                  >
                    <option value="">Wszystkie</option>
                    {kategorie[mainCat].map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {/* Reset filtrów */}
            <button 
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm('')
                setMinPrice('')
                setMaxPrice('')
                setProvince('')
                setCity('')
                setRadius('')
                setMainCat('')
                setSubCat('')
                setSortBy('newest')
                setCurrentPage(1)
                setOfferType('')
              }}
            >
              🔄 Resetuj filtry
            </button>
          </aside>

          <section className={styles.offers}>
            <Advertisement type="banner" />
            
            {/* Przyciski filtrowania typu oferty */}
            <div className={styles.jobTypeFilter}>
              <button
                className={`${styles.jobTypeButton} ${offerType === '' ? styles.active : ''}`}
                onClick={() => setOfferType('')}
              >
                Wszystkie ogłoszenia
              </button>
              <button
                className={`${styles.jobTypeButton} ${offerType === 'szukam_pracy' ? styles.active : ''}`}
                onClick={() => setOfferType('szukam_pracy')}
              >
                Szukam pracy
              </button>
              <button
                className={`${styles.jobTypeButton} ${offerType === 'szukam_pracownika' ? styles.active : ''}`}
                onClick={() => setOfferType('szukam_pracownika')}
              >
                Szukam pracownika
              </button>
            </div>
            
            <OffersSection offers={offers} />
            
            {/* Paginacja */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </section>

          <aside className={styles.ad}>
            <Advertisement type="sidebar" />
            <div className={styles.adBox}>
              <h3>Reklama</h3>
              <p>Twoje miejsce na baner</p>
            </div>
          </aside>
        </div>
      </main>
      
      {/* Dodaj stopkę */}
      <MainFooter />
    </div>
  )
}
