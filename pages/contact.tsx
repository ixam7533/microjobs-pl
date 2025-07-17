import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Contact() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Kontakt</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Skontaktuj się z nami</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Masz pytania, sugestie lub potrzebujesz pomocy? Jesteśmy tutaj, aby Ci pomóc!</p>
              </section>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>Dane kontaktowe</h3>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Email:</strong> kontakt@microjobs.pl</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Telefon:</strong> +48 123 456 789</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Adres:</strong> ul. Przykładowa 123, 00-001 Warszawa</p>
                    <p style={{ lineHeight: '1.6' }}><strong>Godziny pracy:</strong> Pn-Pt 9:00-17:00</p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>Departamenty</h3>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Wsparcie:</strong> pomoc@microjobs.pl</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Biznes:</strong> business@microjobs.pl</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}><strong>Prasa:</strong> media@microjobs.pl</p>
                    <p style={{ lineHeight: '1.6' }}><strong>Kariera:</strong> praca@microjobs.pl</p>
                  </div>
                </div>
              </div>
              
              <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Formularz kontaktowy</h2>
                <form style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Imię i nazwisko</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                    <input type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Temat</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Wiadomość</label>
                    <textarea rows={5} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}></textarea>
                  </div>
                  <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    Wyślij wiadomość
                  </button>
                </form>
              </section>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    </AuthLayout>
  )
}
