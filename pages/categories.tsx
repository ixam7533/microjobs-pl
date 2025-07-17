import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Categories() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Mapa kategorii</h1>
            <div>
              <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>Przeglądaj wszystkie dostępne kategorie usług na MicroJobs:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>🌱 Ogrodnictwo</h3>
                  <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                    <li>Pielęgnacja trawników</li>
                    <li>Sadzenie roślin</li>
                    <li>Projektowanie ogrodów</li>
                    <li>Usługi koszenia</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>🧹 Sprzątanie</h3>
                  <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                    <li>Sprzątanie domów</li>
                    <li>Sprzątanie biur</li>
                    <li>Mycie okien</li>
                    <li>Sprzątanie po remoncie</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>🚚 Transport</h3>
                  <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                    <li>Przeprowadzki</li>
                    <li>Transport rzeczy</li>
                    <li>Kurierzy</li>
                    <li>Pomoc przy załadunku</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>💻 IT i technologie</h3>
                  <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                    <li>Tworzenie stron www</li>
                    <li>Programowanie</li>
                    <li>Naprawa komputerów</li>
                    <li>Wsparcie techniczne</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>🔧 Inne</h3>
                  <ul style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
                    <li>Remonty</li>
                    <li>Naprawa AGD</li>
                    <li>Korepetycje</li>
                    <li>Usługi różne</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    </AuthLayout>
  )
}
