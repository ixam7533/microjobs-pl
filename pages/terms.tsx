import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: "1800px", margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Regulamin MicroJobs</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>1. Postanowienia ogólne</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Niniejszy regulamin określa zasady korzystania z platformy MicroJobs.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Korzystanie z serwisu oznacza akceptację wszystkich postanowień regulaminu.</p>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Właścicielem serwisu jest Mateusz Ziółkowski, a serwis działa zgodnie z polskim prawem.</p>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>2. Rejestracja i konto użytkownika</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Rejestracja jest bezpłatna i dobrowolna</li>
                  <li>Użytkownik jest odpowiedzialny za bezpieczeństwo swojego konta</li>
                  <li>Zabrania się tworzenia fałszywych profili</li>
                  <li>Jedno konto na osobę</li>
                  <li>Minimalna wieku użytkownika: 15 lat</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>3. Zasady publikowania ogłoszeń</h2>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>Zabronione treści:</h3>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', marginBottom: '1rem',color: '#000' }}>
                  <li><strong>Treści dla dorosłych</strong> - usługi o charakterze erotycznym, pornograficznym</li>
                  <li><strong>Przemoc i nienawiść</strong> - treści propagujące przemoc, dyskryminację</li>
                  <li><strong>Nielegalne działania</strong> - narkotyki, nielegalny hazard, kradzież</li>
                  <li><strong>Oszustwa</strong> - piramidy finansowe, fałszywe inwestycje</li>
                  <li><strong>Broń i niebezpieczne przedmioty</strong></li>
                  <li><strong>Falsyfikaty</strong> - podrobione dokumenty, marki, produkty</li>
                  <li><strong>Spam i wielokrotne publikacje</strong> tych samych ogłoszeń</li>
                </ul>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>Wymagania:</h3>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Ogłoszenia muszą być zgodne z prawem polskim</li>
                  <li>Opisy muszą być prawdziwe i nie wprowadzać w błąd</li>
                  <li>Zdjęcia nie mogą zawierać treści przemocy lub nieodpowiednich dla nieletnich</li>
                  <li>Ceny muszą być podane jasno i czytelnie</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>4. Odpowiedzialność użytkowników</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Użytkownicy są w pełni odpowiedzialni za swoje działania</li>
                  <li>MicroJobs nie bierze odpowiedzialności za jakość świadczonych usług</li>
                  <li>Platforma nie odpowiada za szkody powstałe podczas wykonywania pracy</li>
                  <li>Zalecamy weryfikację tożsamości przed podjęciem współpracy</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>5. Płatności i opłaty</h2>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Pierwsze ogłoszenie jest darmowe</li>
                  <li>Kolejne ogłoszenia kosztują 6 zł</li>
                  <li>Promocja ogłoszeń od 3 zł (w zależności od wartości)</li>
                  <li>Subskrypcje PRO: 29 zł/miesiąc, PRO+: 49 zł/miesiąc</li>
                  <li>Płatności są nieodwracalne</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>6. Naruszenia i sankcje</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>W przypadku naruszenia regulaminu możemy:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000' }}>
                  <li>Usunąć naruszające ogłoszenie</li>
                  <li>Zawiesić konto użytkownika</li>
                  <li>Zablokować konto na stałe</li>
                  <li>Przekazać sprawę organom ścigania w przypadku łamania prawa</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>7. Zmiany regulaminu</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000' }}>Zastrzegamy sobie prawo do zmiany regulaminu. O istotnych zmianach poinformujemy użytkowników z 7-dniowym wyprzedzeniem.</p>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>8. Kontakt</h2>
                <p style={{ lineHeight: '1.6',color: '#000' }}>
                  W sprawach związanych z regulaminem skontaktuj się z nami: 
                  <a href="mailto:kontakt@microjobs.pl" style={{ color: '#007bff' }}> microjbusiness@gmail.com</a>
                </p>
              </section>
            </div>
          </div>
      </main>
      <MainFooter />
    </div>
  )
}
