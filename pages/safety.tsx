import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Safety() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: "1800px", margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Zasady bezpieczeństwa</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Bezpieczna współpraca</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Twoje bezpieczeństwo jest dla nas najważniejsze. Przestrzegaj tych zasad:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000'  }}>
                  <li>Zawsze sprawdzaj oceny i opinie innych użytkowników</li>
                  <li>Korzystaj z wbudowanego systemu komunikacji</li>
                  <li>Nie udostępniaj danych osobowych przed potwierdzeniem współpracy</li>
                  <li>Zawsze ustal warunki współpracy na piśmie</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Płatności</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000'  }}>
                  <li>Ustal sposób płatności przed rozpoczęciem pracy</li>
                  <li>Rozważ płatność etapami przy większych projektach</li>
                  <li>Zachowaj dowody płatności</li>
                  <li>Zgłaszaj problemy z płatnościami do administracji</li>
                </ul>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Zgłaszanie problemów</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Jeśli napotkasz problemy, skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000'  }}>
                  <li>Email: microjbusiness@gmail.com</li>
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
