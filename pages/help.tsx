import { useState, useEffect } from 'react'
import Header from '../components/Header'
import MainFooter from '../components/MainFooter'

export default function Help() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 5%', width: '100%', maxWidth: 'none' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: "1800px", margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000' }}>Pomoc</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Jak korzystać z MicroJobs?</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>MicroJobs to platforma łącząca osoby oferujące usługi z tymi, którzy ich potrzebują.</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8',color: '#000'  }}>
                  <li>Przeglądaj oferty w różnych kategoriach</li>
                  <li>Dodawaj własne ogłoszenia</li>
                  <li>Komunikuj się z klientami przez wbudowany chat</li>
                  <li>Oceniaj współpracę z innymi użytkownikami</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Często zadawane pytania</h2>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#000' }}>Jak dodać nowe ogłoszenie?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Kliknij "Dodaj ogłoszenie" w menu głównym i wypełnij formularz.</p>
                  
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#000' }}>Jak kontaktować się z oferentem?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Możesz wysłać email lub skorzystać z wbudowanego chatu.</p>
                  
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#000' }}>Jak promować swoją ofertę?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Skorzystaj z planu Pro, aby wyróżnić swoje ogłoszenia.</p>
                </div>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Kontakt z pomocą</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6',color: '#000'  }}>Jeśli masz pytania, skontaktuj się z nami:</p>
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
