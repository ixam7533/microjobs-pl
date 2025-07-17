import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Terms() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Regulamin</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>1. Postanowienia ogólne</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Niniejszy regulamin określa zasady korzystania z platformy MicroJobs.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Korzystanie z serwisu oznacza akceptację wszystkich postanowień regulaminu.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>2. Rejestracja i konto użytkownika</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Rejestracja jest bezpłatna i dobrowolna</li>
                  <li>Użytkownik jest odpowiedzialny za bezpieczeństwo swojego konta</li>
                  <li>Zabrania się tworzenia fałszywych profili</li>
                  <li>Jedno konto na osobę</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>3. Publikowanie ogłoszeń</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Ogłoszenia muszą być prawdziwe i aktualne</li>
                  <li>Zabrania się publikowania treści niezgodnych z prawem</li>
                  <li>Administracja ma prawo moderować treści</li>
                  <li>Ogłoszenia wygasają po 30 dniach</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>4. Odpowiedzialność</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>MicroJobs pełni rolę pośrednika między użytkownikami. Nie ponosimy odpowiedzialności za jakość świadczonych usług.</p>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>5. Kontakt</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>W sprawach regulaminu skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: regulamin@microjobs.pl</li>
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
