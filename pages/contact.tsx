import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '1800px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Kontakt</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Skontaktuj się z nami</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#000' }}>Masz pytania, sugestie lub potrzebujesz pomocy? Jesteśmy tutaj, aby Ci pomóc!</p>
              </section>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>Dane kontaktowe</h3>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Email:</strong> microjobsj7@gmail.com</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Telefon:</strong> 570 261 054</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Email biznesowy:</strong> microjbusiness@gmail.com</p>
                    <p style={{ lineHeight: '1.6', color: '#000' }}><strong>Godziny pracy:</strong> Pn-Pt 9:00-17:00</p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>Departamenty</h3>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Wsparcie:</strong> microjobsj7@gmail.com</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Biznes:</strong> microjbusiness@gmail.com</p>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', color: '#000' }}><strong>Prasa:</strong> microjbusiness@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Formularz kontaktowy</h2>
                <form style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Imię i nazwisko</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', color: '#000' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Email</label>
                    <input type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', color: '#000' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Temat</label>
                    <input type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', color: '#000' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>Wiadomość</label>
                    <textarea rows={5} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', color: '#000' }}></textarea>
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
  )
}
