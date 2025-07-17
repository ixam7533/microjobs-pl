import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Careers() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Kariera w MicroJobs</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Dołącz do naszego zespołu</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Szukamy utalentowanych osób, które chcą razem z nami budować przyszłość pracy zdalnej i freelancingu.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Oferujemy pracę w dynamicznym startup'ie z możliwością rozwoju i wpływu na kształt produktu.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Aktualne oferty pracy</h2>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Frontend Developer</h3>
                    <p style={{ color: '#888', marginBottom: '1rem' }}>Pełny etat • Zdalna/Warszawa</p>
                    <p style={{ lineHeight: '1.6' }}>Szukamy doświadczonego frontend developera do pracy nad naszą platformą React/Next.js.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Marketing Manager</h3>
                    <p style={{ color: '#888', marginBottom: '1rem' }}>Pełny etat • Zdalna/Warszawa</p>
                    <p style={{ lineHeight: '1.6' }}>Poszukujemy creative marketing managera do rozwoju naszej marki i pozyskiwania użytkowników.</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Customer Success</h3>
                    <p style={{ color: '#888', marginBottom: '1rem' }}>Pełny etat • Zdalna</p>
                    <p style={{ lineHeight: '1.6' }}>Chcemy zatrudnić osobę odpowiedzialną za wsparcie użytkowników i rozwój relacji z klientami.</p>
                  </div>
                </div>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Co oferujemy</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Konkurencyjne wynagrodzenie</li>
                  <li>Elastyczne godziny pracy</li>
                  <li>Możliwość pracy zdalnej</li>
                  <li>Budżet na rozwój i szkolenia</li>
                  <li>Akcje w firmie</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Aplikuj już dziś</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Wyślij swoje CV i list motywacyjny na:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: praca@microjobs.pl</li>
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
