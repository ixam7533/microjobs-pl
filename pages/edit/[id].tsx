import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import { CATEGORIES } from '../../lib/pricing'
import { wojewodztwa, getMiastaForWojewodztwo } from '../../lib/locations'
import styles from '../../components/AddOfferForm.module.css'

export default function EditOffer() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/offers/${id}`)
      .then(r=>r.json())
      .then(data => {
        setForm(data)
      })
      .catch(error => {
        console.error('Error fetching offer:', error)
        alert('Błąd podczas pobierania ogłoszenia')
      })
  }, [id])

  // Ten useEffect musi być zawsze wywoływany, nie warunkowo
  useEffect(() => {
    if (form) {
      handleLocationChange()
    }
  }, [form?.locationProvince, form?.locationCity, form?.locationDetails])

  const handleLocationChange = () => {
    if (!form) return
    const locationParts = []
    if (form.locationCity) locationParts.push(form.locationCity)
    if (form.locationProvince) locationParts.push(form.locationProvince)
    if (form.locationDetails) locationParts.push(form.locationDetails)
    setForm({ ...form, location: locationParts.join(', ') })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      
      if (response.ok) {
        alert('Ogłoszenie zostało zaktualizowane!')
        router.push('/profile')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        alert(`Błąd: ${error.error || 'Nie udało się zaktualizować ogłoszenia'}`)
      }
    } catch (error) {
      console.error('Network Error updating offer:', error)
      alert('Wystąpił błąd sieci podczas aktualizacji ogłoszenia. Sprawdź połączenie internetowe.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'number' ? parseFloat(value) || 0 : value
    setForm({ ...form, [name]: newValue })
  }

  if (!form) return <div style={{ padding: '20px', textAlign: 'center' }}>Ładuję...</div>

  return (
    <>
      <Header />
      <div className={styles.pageWrapper} style={{ minHeight: '100vh', padding: '20px 0' }}>
        <form className={styles.addOfferForm} onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Edytuj ogłoszenie</h1>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Tytuł ogłoszenia *</label>
              <input
                type="text"
                name="title"
                value={form.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Opis *</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cena (zł) *</label>
              <input
                type="number"
                name="price"
                value={form.price || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Kategoria * (nie można zmieniać)</label>
              <select
                name="category"
                value={form.category || ''}
                onChange={handleInputChange}
                disabled
                required
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                <option value="">Wybierz kategorię</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                ℹ️ Ze względów bezpieczeństwa kategoria nie może być zmieniana po utworzeniu ogłoszenia
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Lokalizacja *</label>
              <div className={styles.locationSection}>
                <div className={styles.locationRow}>
                  <div className={styles.locationField}>
                    <label>Województwo</label>
                    <select
                      name="locationProvince"
                      value={form.locationProvince || ''}
                      onChange={(e) => {
                        setForm({ ...form, locationProvince: e.target.value, locationCity: '' })
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
                      name="locationCity"
                      value={form.locationCity || ''}
                      onChange={handleInputChange}
                      disabled={!form.locationProvince}
                      required
                    >
                      <option value="">Wybierz miasto</option>
                      {form.locationProvince && getMiastaForWojewodztwo(form.locationProvince).map(miasto => (
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
                      name="locationDetails"
                      value={form.locationDetails || ''}
                      onChange={handleInputChange}
                      placeholder="Dzielnica, ulica..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Imię i nazwisko *</label>
              <input
                type="text"
                name="contactName"
                value={form.contactName || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email * - wpisz email zgodny z emailem z używanego konta</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Telefon</label>
              <input
                type="tel"
                name="contactPhone"
                value={form.contactPhone || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.stepButtons} style={{ justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <button 
              type="button" 
              className={styles.backBtn}
              onClick={() => router.push('/profile')}
            >
              Anuluj
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
