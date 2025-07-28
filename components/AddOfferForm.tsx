// components/AddOfferForm.tsx
import { useState, useEffect } from 'react'
import { CATEGORIES, calculateFees, PRO_VERSIONS } from '../lib/pricing'
import { wojewodztwa, getMiastaForWojewodztwo } from '../lib/locations'
import PublishButtonDirect from './PublishButtonDirect'
import PublishButtonFree from './PublishButtonFree'
import PublishWithPromo1Direct from './PublishWithPromo1Direct'
import PublishWithPromoFree from './PublishWithPromoFree'
import PublishWithPromo2 from './PublishWithPromo2'
import PublishWithPromo3 from './PublishWithPromo3'
import styles from './AddOfferForm.module.css'

interface OfferData {
  [key: string]: any; // Pozwala na wszelkie właściwości
}

interface AddOfferFormProps {
  onSubmit: (data: OfferData) => void
  isFirstOffer?: boolean
  userHasPro?: boolean
  userProType?: 'PRO' | 'PRO_PLUS' | null
}

type OfferType = 'szukam_pracownika' | 'szukam_pracy'

export default function AddOfferForm({ onSubmit, isFirstOffer = false, userHasPro = false, userProType = null }: AddOfferFormProps) {
  console.log('🔍 AddOfferForm props:', { isFirstOffer, userHasPro, userProType })
  
  // Sprawdzenie czy użytkownik kwalifikuje się do darmowej publikacji
  const qualifiesForFreePublication = isFirstOffer || userHasPro
  console.log('🔍 qualifiesForFreePublication:', qualifiesForFreePublication)
  
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
  const [wantPaidPromo, setWantPaidPromo] = useState(false) // PRO+ może wybrać płatną promocję
  const [fees, setFees] = useState({ addPrice: 0, promoPrice: 0, total: 0 })
  const [savedDraftId, setSavedDraftId] = useState<number | null>(null)

  // Funkcja do obsługi zapisania draft
  const handleDraftSaved = (draftId: number) => {
    setSavedDraftId(draftId)
    alert(`Ogłoszenie zapisane jako draft (ID: ${draftId}). Po opłaceniu zostanie automatycznie opublikowane.`)
  }

  // Funkcja do obsługi pomyślnej publikacji
  const handlePublishSuccess = () => {
    // Wyczyść formularz
    setStep(1)
    setOfferType('szukam_pracownika')
    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')
    setSubcategories([])
    setLocation('')
    setLocationProvince('')
    setLocationCity('')
    setLocationDetails('')
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setImages([])
    setWantPromo(false)
    setWantPaidPromo(false)
    setSavedDraftId(null)
    
    // Informuj parent component o publikacji (opcjonalne)
    onSubmit({ success: true, action: 'published' })
    
    // Odśwież stronę po 2 sekundach, żeby zaktualizować licznik
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  // Funkcja do pobierania danych formularza
  const getFormData = () => {
    return {
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
      wantPromo
    }
  }

  // Funkcja do określenia odpowiedniego przycisku promocji na podstawie ceny
  const getPromoWithPublishButton = (price: number) => {
    const formData = getFormData()
    
    if (price >= 0 && price <= 100) {
      return <PublishWithPromo1Direct offerData={formData} onSuccess={handlePublishSuccess} />
    } else if (price >= 101 && price <= 300) {
      return <PublishWithPromo2 />
    } else if (price >= 301 && price <= 1000) {
      return <PublishWithPromo3 />
    }
    return null // Powyżej 1000zł brak promocji
  }

  // Funkcja do określenia ceny promocji + publikacji na podstawie ceny ogłoszenia
  const getPromoWithPublishPrice = (price: number) => {
    if (price >= 0 && price <= 100) {
      return 10.00 // 6zł publikacja + 4zł promocja
    } else if (price >= 101 && price <= 300) {
      return 16.99 // 6zł publikacja + 10.99zł promocja
    } else if (price >= 301 && price <= 1000) {
      return 21.00 // 6zł publikacja + 15zł promocja
    }
    return 0 // Powyżej 1000zł brak promocji
  }

  useEffect(() => {
    if (price) {
      const priceNum = parseFloat(price) || 0
      
      if (qualifiesForFreePublication) {
        // Pierwsza oferta lub użytkownicy PRO/PRO+ mają darmowe ogłoszenia
        setFees({
          addPrice: 0, // Darmowe ogłoszenie
          promoPrice: (userProType === 'PRO_PLUS' || (userProType === 'PRO' && !wantPaidPromo)) ? 0 : (wantPromo ? calculateFees(priceNum, true).promoPrice : 0), // PRO+ ma darmowe promocje, PRO ma 1 darmową promocję lub płatną
          total: (userProType === 'PRO_PLUS' || (userProType === 'PRO' && !wantPaidPromo)) ? 0 : (wantPromo ? calculateFees(priceNum, true).promoPrice : 0)
        })
      } else {
        // Dla użytkowników bez PRO i nie pierwsza oferta - standardowe opłaty
        setFees(calculateFees(priceNum, wantPromo))
      }
    } else {
      setFees({ addPrice: 0, promoPrice: 0, total: 0 })
    }
  }, [price, wantPromo, isFirstOffer, userHasPro, userProType, wantPaidPromo])

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
      const newFiles = Array.from(e.target.files)
      // Dodaj nowe pliki do istniejących, ale nie przekraczaj limitu 3
      setImages(prev => {
        const combined = [...prev, ...newFiles]
        return combined.slice(0, 3)
      })
    }
    // Wyczyść input, żeby można było dodać te same pliki ponownie
    e.target.value = ''
  }

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove))
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
      fees: qualifiesForFreePublication ? { addPrice: 0, promoPrice: 0, total: 0 } : fees,
      userProType
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
            style={{ color: 'white' }}
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
            style={{ color: 'white' }}
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
          <label>Zdjęcia (1-3 zdjęcia)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
            disabled={images.length >= 3}
          />
          {images.length >= 3 && (
            <small style={{ color: '#ffa500', marginTop: '5px', display: 'block' }}>
              Maksymalnie 3 zdjęcia. Usuń jedno, żeby dodać nowe.
            </small>
          )}
          
          {images.length > 0 && (
            <div className={styles.imagePreviewGrid}>
              <small style={{ marginBottom: '10px', display: 'block' }}>
                {images.length} z 3 zdjęć wybranych
              </small>
              <div className={styles.imagesList}>
                {images.map((file, index) => (
                  <div key={index} className={styles.imagePreviewItem}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Podgląd ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImageBtn}
                      title="Usuń zdjęcie"
                    >
                      ×
                    </button>
                    <span className={styles.imageName}>
                      {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <label>Email * - wpisz email zgodny z emailem z używanego konta</label>
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

  const renderStep6 = () => {
    const priceValue = parseFloat(price || '0')
    const publishPrice = 6.00 // Stała cena publikacji
    const promoWithPublishPrice = getPromoWithPublishPrice(priceValue)
    const isPromoAvailable = priceValue <= 1000

    return (
      <div className={`${styles.step} ${styles.step6}`}>
        <h2>Publikacja ogłoszenia</h2>
        
        {savedDraftId && (
          <div style={{
            backgroundColor: '#e7f5e7',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#2e7d2e', margin: '0 0 10px 0' }}>✅ Ogłoszenie zapisane!</h4>
            <p style={{ margin: '0', color: '#2e7d2e' }}>
              Twoje ogłoszenie (ID: {savedDraftId}) zostało zapisane i będzie opublikowane automatycznie po opłaceniu.
            </p>
          </div>
        )}

        {/* Banner informujący o korzyściach PRO/PRO+ */}
        {userHasPro && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>
              🌟 Konto {userProType} - Korzyści Premium!
            </h4>
            <p style={{ margin: '0', color: '#856404' }}>
              {userProType === 'PRO_PLUS' 
                ? 'Masz darmowe publikacje i nielimitowane darmowe promocje! Możesz też wybrać płatną promocję jeśli nie chcesz wykorzystywać limitu.'
                : 'Masz darmowe publikacje i 1 darmową promocję miesięcznie! Możesz też wybrać płatną promocję.'
              }
            </p>
          </div>
        )}
        
        <div className={styles.publishOptions}>
          <div className={styles.optionSection}>
            <h4 className={styles.optionTitle}>
              {qualifiesForFreePublication ? 
                (isFirstOffer ? 'Darmowa publikacja (pierwsza oferta!)' : 'Darmowa publikacja (PRO)') 
                : 'Zwykła publikacja'
              }
            </h4>
            <div className={styles.priceInfo}>
              <span className={styles.priceAmount}>
                {qualifiesForFreePublication ? 'DARMOWE' : '6 zł'}
              </span>
              <span className={styles.priceDescription}>Publikacja na 30 dni</span>
            </div>
            {qualifiesForFreePublication ? (
              <PublishButtonFree offerData={getFormData()} onPublishSuccess={handlePublishSuccess} />
            ) : (
              <PublishButtonDirect offerData={getFormData()} onSuccess={handlePublishSuccess} />
            )}
          </div>

          {isPromoAvailable && (
            <div className={styles.optionSection}>
              {/* Checkbox promocji */}
              <div className={styles.promoCheckbox}>
                <label>
                  <input
                    type="checkbox"
                    checked={wantPromo}
                    onChange={(e) => setWantPromo(e.target.checked)}
                  />
                  <span>Chcę promować to ogłoszenie</span>
                </label>
              </div>

              {wantPromo && (
                <div className={styles.promoOption}>
                  {/* Opcje promocji dla PRO+ i PRO */}
                  {(userProType === 'PRO_PLUS' || userProType === 'PRO') && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <input
                            type="radio"
                            name="promoType"
                            checked={!wantPaidPromo}
                            onChange={() => setWantPaidPromo(false)}
                          />
                          <span style={{ color: '#333', fontSize: '16px' }}>
                            Użyj darmowej promocji ({userProType})
                          </span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="radio"
                            name="promoType"
                            checked={wantPaidPromo}
                            onChange={() => setWantPaidPromo(true)}
                          />
                          <span style={{ color: '#333', fontSize: '16px' }}>
                            Płatna promocja (bez wykorzystywania limitu)
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <h4 className={styles.optionTitle}>Publikacja + Promocja</h4>
                  <div className={styles.priceInfo}>
                    <span className={styles.priceAmount}>
                      {(userProType === 'PRO_PLUS' || userProType === 'PRO') && !wantPaidPromo 
                        ? 'DARMOWE' 
                        : `${promoWithPublishPrice} zł`
                      }
                    </span>
                    <span className={styles.priceDescription}>
                      Publikacja + promocja (wyświetlane wyżej w wynikach)
                    </span>
                  </div>
                  
                  {/* Przyciski promocji */}
                  {(userProType === 'PRO_PLUS' || userProType === 'PRO') && !wantPaidPromo ? (
                    <PublishWithPromoFree offerData={getFormData()} onPublishSuccess={handlePublishSuccess} />
                  ) : userHasPro && !wantPaidPromo ? (
                    <PublishButtonDirect offerData={getFormData()} onSuccess={handlePublishSuccess} />
                  ) : (
                    getPromoWithPublishButton(priceValue)
                  )}
                </div>
              )}
            </div>
          )}

          {!isPromoAvailable && (
            <div className={styles.noPromoInfo}>
              <p>Promocja dostępna tylko dla ofert do 1000 zł</p>
            </div>
          )}
        </div>
        
        {/* Przycisk Wstecz w kroku 6 */}
        <div className={styles.stepButtons}>
          <button type="button" className={styles.backBtn} onClick={() => setStep(5)}>
            Wstecz
          </button>
        </div>
      </div>
    )
  }

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
