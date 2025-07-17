// pages/test-locations.tsx
import { useState } from 'react'
import { wojewodztwa, getMiastaForWojewodztwo } from '../lib/locations'

export default function TestLocations() {
  const [selectedWojewodztwo, setSelectedWojewodztwo] = useState('')
  const [selectedMiasto, setSelectedMiasto] = useState('')
  
  const miasta = selectedWojewodztwo ? getMiastaForWojewodztwo(selectedWojewodztwo) : []
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Lokalizacji</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Województwo:
          <select
            value={selectedWojewodztwo}
            onChange={(e) => {
              setSelectedWojewodztwo(e.target.value)
              setSelectedMiasto('')
            }}
            style={{ marginLeft: '1rem', padding: '0.5rem' }}
          >
            <option value="">Wybierz województwo</option>
            {wojewodztwa.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </label>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Miasto:
          <select
            value={selectedMiasto}
            onChange={(e) => setSelectedMiasto(e.target.value)}
            disabled={!selectedWojewodztwo}
            style={{ marginLeft: '1rem', padding: '0.5rem' }}
          >
            <option value="">Wybierz miasto</option>
            {miasta.map(miasto => (
              <option key={miasto} value={miasto}>{miasto}</option>
            ))}
          </select>
        </label>
      </div>
      
      {selectedWojewodztwo && (
        <div>
          <h3>Informacje:</h3>
          <p>Województwo: {selectedWojewodztwo}</p>
          <p>Liczba miast: {miasta.length}</p>
          {selectedMiasto && <p>Wybrane miasto: {selectedMiasto}</p>}
        </div>
      )}
    </div>
  )
}
