// pages/test-promo.tsx
import { useState } from 'react'
import PromoButton1 from '../components/PromoButton1'
import PromoButton2 from '../components/PromoButton2'
import PromoButton3 from '../components/PromoButton3'

export default function TestPromo() {
  const [testPrice, setTestPrice] = useState(50)

  const getPromoButton = (price: number) => {
    if (price >= 0 && price <= 60) {
      return <PromoButton1 />
    } else if (price >= 61 && price <= 200) {
      return <PromoButton2 />
    } else if (price >= 201 && price <= 1000) {
      return <PromoButton3 />
    }
    return <p>Brak promocji dla tej ceny</p>
  }

  const getPromoPrice = (price: number) => {
    if (price >= 0 && price <= 60) {
      return 4.00
    } else if (price >= 61 && price <= 200) {
      return 9.99
    } else if (price >= 201 && price <= 1000) {
      return 15.00
    }
    return 0
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Przycisków Promocji</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <label>
          Cena testowa: 
          <input 
            type="number" 
            value={testPrice} 
            onChange={(e) => setTestPrice(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
          zł
        </label>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        <h3>Dla ceny {testPrice} zł:</h3>
        <p>Promocja kosztuje: {getPromoPrice(testPrice)} zł</p>
        <p>Zakres cen:</p>
        <ul>
          <li>0-60 zł → 4 zł (zielony przycisk)</li>
          <li>61-200 zł → 9.99 zł (pomarańczowy przycisk)</li>
          <li>201-1000 zł → 15 zł (czerwony przycisk)</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3>Przycisk dla ceny {testPrice} zł:</h3>
        {getPromoButton(testPrice)}
      </div>

      <hr style={{ margin: '40px 0' }} />

      <h2>Wszystkie przyciski promocji:</h2>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h4>Promocja 4zł (0-60zł)</h4>
          <p>Zielony przycisk</p>
          <PromoButton1 />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h4>Promocja 9.99zł (61-200zł)</h4>
          <p>Pomarańczowy przycisk</p>
          <PromoButton2 />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h4>Promocja 15zł (201-1000zł)</h4>
          <p>Czerwony przycisk</p>
          <PromoButton3 />
        </div>
      </div>
    </div>
  )
}
