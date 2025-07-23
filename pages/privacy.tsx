import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: "1800px", margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Polityka prywatności</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>1. Informacje ogólne</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Niniejsza polityka prywatności określa zasady przetwarzania danych osobowych w serwisie MicroJobs.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Administratorem danych osobowych jest MicroJobs Sp. z o.o.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>2. Zbierane dane</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Adres email i imię (podczas rejestracji)</li>
                  <li>Dane kontaktowe w ogłoszeniach</li>
                  <li>Logi aktywności w serwisie</li>
                  <li>Pliki cookies</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>3. Cel przetwarzania</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Świadczenie usług platformy</li>
                  <li>Komunikacja z użytkownikami</li>
                  <li>Poprawa jakości serwisu</li>
                  <li>Bezpieczeństwo platformy</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>4. Twoje prawa</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Prawo dostępu do danych</li>
                  <li>Prawo do sprostowania danych</li>
                  <li>Prawo do usunięcia danych</li>
                  <li>Prawo do ograniczenia przetwarzania</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>5. Kontakt</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>W sprawach ochrony danych osobowych skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Email: microjobsj7@gmail.com</li>
                  <li>Telefon: +48 570 261 054</li>
                </ul>
              </section>
            </div>
          </div>
      </main>
      <MainFooter />
    </div>
  )
}
