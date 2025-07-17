import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function About() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Jak działa MicroJobs</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Czym jest MicroJobs?</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>MicroJobs to innowacyjna platforma łącząca osoby oferujące usługi z tymi, którzy ich potrzebują. Naszym celem jest stworzenie bezpiecznego i wygodnego miejsca do znajdowania pracy i specjalistów.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Jak to działa?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>1. Szukaj usług</h3>
                    <p style={{ lineHeight: '1.6' }}>Przeglądaj oferty w różnych kategoriach i znajdź idealnego specjalistę dla swojego projektu.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>2. Nawiąż kontakt</h3>
                    <p style={{ lineHeight: '1.6' }}>Skontaktuj się z oferentem przez email lub wbudowany system komunikacji.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>3. Oceń współpracę</h3>
                    <p style={{ lineHeight: '1.6' }}>Po zakończeniu projektu oceń współpracę, aby pomóc innym użytkownikom.</p>
                  </div>
                </div>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Dlaczego MicroJobs?</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Bezpieczeństwo i weryfikacja użytkowników</li>
                  <li>System ocen i opinii</li>
                  <li>Wbudowany system komunikacji</li>
                  <li>Szerokie spektrum usług</li>
                  <li>Łatwe promowanie ofert</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Skontaktuj się z nami</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Masz pytania? Chętnie pomożemy:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: info@microjobs.pl</li>
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
