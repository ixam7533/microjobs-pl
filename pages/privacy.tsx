import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Privacy() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Polityka prywatności</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>1. Informacje ogólne</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Niniejsza polityka prywatności określa zasady przetwarzania danych osobowych w serwisie MicroJobs.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Administratorem danych osobowych jest MicroJobs Sp. z o.o.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>2. Zbierane dane</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Adres email i imię (podczas rejestracji)</li>
                  <li>Dane kontaktowe w ogłoszeniach</li>
                  <li>Logi aktywności w serwisie</li>
                  <li>Pliki cookies</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>3. Cel przetwarzania</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Świadczenie usług platformy</li>
                  <li>Komunikacja z użytkownikami</li>
                  <li>Poprawa jakości serwisu</li>
                  <li>Bezpieczeństwo platformy</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>4. Twoje prawa</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Prawo dostępu do danych</li>
                  <li>Prawo do sprostowania danych</li>
                  <li>Prawo do usunięcia danych</li>
                  <li>Prawo do ograniczenia przetwarzania</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>5. Kontakt</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>W sprawach ochrony danych osobowych skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: rodo@microjobs.pl</li>
                  <li>Telefon: +48 123 456 789</li>
                </ul>
              </section>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    </AuthLayout>
  )
}
