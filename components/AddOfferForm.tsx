// components/AddOfferForm.tsx
import { useState, useEffect } from 'react'
import { CATEGORIES, calculateFees, PRO_VERSIONS } from '../lib/pricing'
import { wojewodztwa, getMiastaForWojewodztwo } from '../lib/locations'
import styles from './AddOfferForm.module.css'

interface AddOfferFormProps {
  onSubmit: (data: any) => void
  isFirstOffer?: boolean
  userHasPro?: boolean
}

type OfferType = 'szukam_pracownika' | 'szukam_pracy'

export default function AddOfferForm({ onSubmit, isFirstOffer = false, userHasPro = false }: AddOfferFormProps) {
  const [step, setStep] = useState(1)
  const [offerType, setOfferType] = useState<OfferType>('szukam_pracownika')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [locationProvince, setLocationProvince] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationDetails, setLocationDetails] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [wantPromo, setWantPromo] = useState(false)
  const [fees, setFees] = useState({ addPrice: 0, promoPrice: 0, total: 0 })

  useEffect(() => {
    if (price && !isFirstOffer && !userHasPro) {
      const priceNum = parseFloat(price) || 0
      setFees(calculateFees(priceNum, wantPromo))
    } else {
      setFees({ addPrice: 0, promoPrice: 0, total: 0 })
    }
  }, [price, wantPromo, isFirstOffer, userHasPro])

  // Aktualizuj lokalizację gdy zmienią się województwo/miasto/szczegóły
  useEffect(() => {
    const locationParts = []
    if (locationCity) locationParts.push(locationCity)
    if (locationProvince) locationParts.push(locationProvince)
    if (locationDetails) locationParts.push(locationDetails)
    setLocation(locationParts.join(', '))
  }, [locationProvince, locationCity, locationDetails])

  const handleSubcategoryToggle = (subcategory: string) => {
    setSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 7))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      offerType,
      title,
      description,
      price: parseFloat(price) || 0,
      category,
      subcategories,
      location,
      contactName,
      contactEmail,
      contactPhone,
      images,
      wantPromo,
      fees: userHasPro || isFirstOffer ? { addPrice: 0, promoPrice: 0, total: 0 } : fees
    }
    onSubmit(formData)
  }

  const renderStep1 = () => (
    <div className={styles.step}>
      <h2>Wybierz rodzaj ogłoszenia</h2>
      
      {/* Informacja o darmowym pierwszym ogłoszeniu */}
      {isFirstOffer && (
        <div className={styles.freeOfferBanner}>
          <div className={styles.freeOfferBannerIcon}>🎉</div>
          <div className={styles.freeOfferBannerText}>
            <strong>Twoje pierwsze ogłoszenie jest DARMOWE!</strong>
            <p>Publikuj bez żadnych opłat - to nasza forma powitania</p>
          </div>
        </div>
      )}

      <div className={styles.offerTypeGrid}>
        <button
          type="button"
          className={`${styles.offerTypeCard} ${offerType === 'szukam_pracownika' ? styles.active : ''}`}
          onClick={() => setOfferType('szukam_pracownika')}
        >
          <div className={styles.offerTypeIcon}>💼</div>
          <h3>Oferuję pracę</h3>
          <p>Szukam kogoś do wykonania zadania</p>
        </button>
        <button
          type="button"
          className={`${styles.offerTypeCard} ${offerType === 'szukam_pracy' ? styles.active : ''}`}
          onClick={() => setOfferType('szukam_pracy')}
        >
          <div className={styles.offerTypeIcon}>🔍</div>
          <h3>Szukam pracy</h3>
          <p>Chcę świadczyć usługi</p>
        </button>
      </div>
      <button 
        type="button" 
        className={styles.nextBtn}
        onClick={() => setStep(2)}
      >
        Dalej
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className={styles.step}>
      <h2>Wybierz kategorię</h2>
      <div className={styles.categoryGrid}>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            type="button"
            className={`${styles.categoryCard} ${category === key ? styles.active : ''}`}
            onClick={() => {
              setCategory(key)
              setSubcategories([])
            }}
          >
            <h3>{cat.name}</h3>
            <p>{cat.subcategories.length} podkategorii</p>
          </button>
        ))}
      </div>
      <div className={styles.stepButtons}>
        <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
          Wstecz
        </button>
        <button 
          type="button" 
          className={styles.nextBtn}
          onClick={() => setStep(3)}
          disabled={!category}
        >
          Dalej
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className={styles.step}>
      <h2>Wybierz podkategorie</h2>
      <p className={styles.subtitle}>Możesz wybrać kilka opcji</p>
      <div className={styles.subcategoryGrid}>
        {category && CATEGORIES[category as keyof typeof CATEGORIES].subcategories.map(sub => (
          <button
            key={sub}
            type="button"
            className={`${styles.subcategoryTag} ${subcategories.includes(sub) ? styles.active : ''}`}
            onClick={() => handleSubcategoryToggle(sub)}
          >
            {sub}
          </button>
        ))}
      </div>
      <div className={styles.stepButtons}>
        <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>
          Wstecz
        </button>
        <button 
          type="button" 
          className={styles.nextBtn}
          onClick={() => setStep(4)}
          disabled={subcategories.length === 0}
        >
          Dalej
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className={styles.step}>
      <h2>Szczegóły ogłoszenia</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Tytuł ogłoszenia *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Np. Koszenie trawy w ogrodzie"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Opis *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opisz szczegółowo czego potrzebujesz lub co oferujesz..."
            rows={4}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cena (zł) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Lokalizacja *</label>
          <div className={styles.locationSection}>
            <div className={styles.locationRow}>
              <div className={styles.locationField}>
                <label>Województwo</label>
                <select
                  value={locationProvince}
                  onChange={(e) => {
                    setLocationProvince(e.target.value)
                    setLocationCity('') // Reset miasta przy zmianie województwa
                  }}
                  required
                >
                  <option value="">Wybierz województwo</option>
                  {wojewodztwa.map(w => (
                    <option key={w} value={w}>
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.locationField}>
                <label>Miasto</label>
                <select
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  disabled={!locationProvince}
                  required
                >
                  <option value="">Wybierz miasto</option>
                  {locationProvince && getMiastaForWojewodztwo(locationProvince).map(miasto => (
                    <option key={miasto} value={miasto}>
                      {miasto}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.locationRow}>
              <div className={styles.locationField}>
                <label>Szczegóły (opcjonalne)</label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="Dzielnica, ulica..."
                />
              </div>
            </div>
            
            {location && (
              <div className={styles.locationPreview}>
                <strong>Pełna lokalizacja:</strong> {location}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Zdjęcia (max 7)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
        </div>
      </div>

      <div className={styles.stepButtons}>
        <button type="button" className={styles.backBtn} onClick={() => setStep(3)}>
          Wstecz
        </button>
        <button 
          type="button" 
          className={styles.nextBtn}
          onClick={() => setStep(5)}
          disabled={!title || !description || !price || !locationProvince || !locationCity}
        >
          Dalej
        </button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className={styles.step}>
      <h2>Dane kontaktowe</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Imię i nazwisko *</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Jan Kowalski"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email *</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="jan@example.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Telefon</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+48 123 456 789"
          />
        </div>
      </div>

      <div className={styles.stepButtons}>
        <button type="button" className={styles.backBtn} onClick={() => setStep(4)}>
          Wstecz
        </button>
        <button 
          type="button" 
          className={styles.nextBtn}
          onClick={() => setStep(6)}
          disabled={!contactName || !contactEmail}
        >
          Dalej
        </button>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className={styles.step}>
      <h2>Promocja i płatność</h2>
      
      {/* Sekcja promocji - tylko dla płatnych ogłoszeń */}
      {!userHasPro && !isFirstOffer && (
        <div className={styles.promoSection}>
          <label className={styles.promoLabel}>
            <input
              type="checkbox"
              checked={wantPromo}
              onChange={(e) => setWantPromo(e.target.checked)}
            />
            <span>Chcę promować to ogłoszenie (+{fees.promoPrice.toFixed(2)} zł)</span>
          </label>
        </div>
      )}

      <div className={styles.pricingSummary}>
        <h3>Podsumowanie kosztów</h3>
        
        {/* Pierwsze ogłoszenie - DARMOWE */}
        {isFirstOffer && (
          <div className={styles.freeOffer}>
            <div className={styles.freeOfferIcon}>🎉</div>
            <div className={styles.freeOfferText}>
              <h4>Twoje pierwsze ogłoszenie jest DARMOWE!</h4>
              <p>Publikuj bez żadnych opłat. To nasza forma powitania nowych użytkowników na MicroJobs. Kolejne ogłoszenia będą płatne zgodnie z cennikiem, ale pierwsze dodajesz za darmo!</p>
            </div>
          </div>
        )}
        
        {/* Użytkownik PRO */}
        {userHasPro && !isFirstOffer && (
          <div className={styles.proUser}>
            <div className={styles.proUserIcon}>⭐</div>
            <div className={styles.proUserText}>
              <h4>Użytkownik PRO</h4>
              <p>Dodawanie ogłoszeń bez dodatkowych opłat</p>
            </div>
          </div>
        )}
        
        {/* Standardowe opłaty */}
        {!isFirstOffer && !userHasPro && (
          <div className={styles.feeBreakdown}>
            <div className={styles.feeItem}>
              <span>Opłata za ogłoszenie:</span>
              <span>{fees.addPrice.toFixed(2)} zł</span>
            </div>
            {wantPromo && (
              <div className={styles.feeItem}>
                <span>Promocja:</span>
                <span>{fees.promoPrice.toFixed(2)} zł</span>
              </div>
            )}
            <div className={styles.feeTotal}>
              <span>Razem:</span>
              <span>{fees.total.toFixed(2)} zł</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.stepButtons}>
        <button type="button" className={styles.backBtn} onClick={() => setStep(5)}>
          Wstecz
        </button>
        <button 
          type="submit" 
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          {isFirstOffer || userHasPro ? 'Opublikuj ogłoszenie DARMOWO' : fees.total > 0 ? `Zapłać ${fees.total.toFixed(2)} zł i opublikuj` : 'Opublikuj ogłoszenie'}
        </button>
      </div>
    </div>
  )

  return (
    <form className={styles.addOfferForm}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>Krok {step} z 6</span>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </form>
  )
}
