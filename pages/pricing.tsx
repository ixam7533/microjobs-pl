import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '1800px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Cennik MicroJobs</h1>
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Publikowanie ogłoszeń</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#28a745' }}>🆓 Pierwsze ogłoszenie</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',color: '#000' }}>DARMOWE</p>
                  <ul style={{ lineHeight: '1.6', color: '#000' }}>
                    <li>Pierwsze ogłoszenie za darmo</li>
                    <li>Standardowa widoczność</li>
                    <li>Podstawowe funkcje</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>📋 Kolejne ogłoszenia</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',color: '#000' }}>6 zł</p>
                  <ul style={{ lineHeight: '1.6', color: '#000' }}>
                    <li>Standardowa publikacja</li>
                    <li>Widoczność przez 30 dni</li>
                    <li>Dostęp do wszystkich funkcji</li>
                  </ul>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Promocja ogłoszeń</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>⭐ Promocja standardowa</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',color: '#000' }}>od 4 zł</p>
                  <ul style={{ lineHeight: '1.6', color: '#000' }}>
                    <li>Wyróżnienie na 7 dni</li>
                    <li>Wyższa pozycja w wynikach</li>
                    <li>Zwiększona widoczność</li>
                    <li>Cena zależna od wartości ogłoszenia</li>
                  </ul>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Subskrypcje PRO</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#856404' }}>🌟 PRO</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',color: '#000' }}>15 zł/miesiąc</p>
                  <ul style={{ lineHeight: '1.6', color: '#000' }}>
                    <li>Darmowe publikowanie ogłoszeń</li>
                    <li>3 darmowe promocje miesięcznie</li>
                    <li>Priorytetowa obsługa</li>
                    <li>Zaawansowane statystyki</li>
                  </ul>
                </div>
                
                <div style={{ backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0c5460' }}>💎 PRO+</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',color: '#000' }}>25 zł/miesiąc</p>
                  <ul style={{ lineHeight: '1.6', color: '#000' }}>
                    <li>Wszystko z pakietu PRO</li>
                    <li><strong>Nieograniczone promocje darmowe!</strong></li>
                    <li>Dedykowany menadżer konta</li>
                    <li>Możliwość personalizacji profilu</li>
                  </ul>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Jak działa promocja?</h2>
              <div style={{ backgroundColor: '#e9ecef', padding: '1.5rem', borderRadius: '8px' }}>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#000' }}>
                  <strong>Koszt promocji zależy od wartości ogłoszenia:</strong>
                </p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#000' }}>
                  <li>Do 100 zł: 4 zł za promocję</li>
                  <li>101-200 zł: 10.99 zł za promocję</li>
                  <li>201-1000 zł: 15 zł za promocję</li>
                  <li>Powyżej 1000 zł: promocja niedostępna</li>
                </ul>
                <p style={{ marginTop: '1rem', lineHeight: '1.6', fontStyle: 'italic',color: '#000' }}>
                  Promocja trwa 7 dni i zapewnia lepszą widoczność Twojego ogłoszenia.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Masz pytania?</h2>
              <p style={{ lineHeight: '1.6', color: '#000' }}>
                Skontaktuj się z nami pod adresem{' '}
                <a href="microjbusiness@gmail.com" style={{ color: '#007bff' }}>
                  microjbusiness@gmail.com
                </a>
                {' '}lub sprawdź naszą{' '}
                <a href="/help" style={{ color: '#007bff' }}>
                  stronę pomocy
                </a>
                .
              </p>
            </section>
          </div>
        </main>
        <MainFooter />
      </div>
  )
}
