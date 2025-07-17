import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Safety() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Zasady bezpieczeństwa</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Bezpieczna współpraca</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Twoje bezpieczeństwo jest dla nas najważniejsze. Przestrzegaj tych zasad:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Zawsze sprawdzaj oceny i opinie innych użytkowników</li>
                  <li>Korzystaj z wbudowanego systemu komunikacji</li>
                  <li>Nie udostępniaj danych osobowych przed potwierdzeniem współpracy</li>
                  <li>Zawsze ustal warunki współpracy na piśmie</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Płatności</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Ustal sposób płatności przed rozpoczęciem pracy</li>
                  <li>Rozważ płatność etapami przy większych projektach</li>
                  <li>Zachowaj dowody płatności</li>
                  <li>Zgłaszaj problemy z płatnościami do administracji</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Zgłaszanie problemów</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Jeśli napotkasz problemy, skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: bezpieczenstwo@microjobs.pl</li>
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
