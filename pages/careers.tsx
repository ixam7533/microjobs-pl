import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Careers() {
  return (
    <>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
        <Header />
        <main style={{ flex: 1, padding: "2rem 5%", maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Kariera w MicroJobs</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Dołącz do naszego zespołu</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#000' }}>MicroJobs to rozwijająca się platforma łącząca freelancerów z klientami. Szukamy utalentowanych osób, które chcą budować przyszłość pracy.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#222' }}>Aktualne oferty pracy</h2>
                <div style={{ backgroundColor: '#e9ecef', padding: '1.5rem', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#000' }}>
                    Obecnie nie mamy otwartych pozycji, ale zawsze szukamy utalentowanych ludzi.
                  </p>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#000' }}>
                    Jeśli chcesz dołączyć do naszego zespołu, wyślij swoje CV na adres: <strong>careers@microjobs.pl</strong>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <MainFooter />
      </div>
    </>
  )
}
