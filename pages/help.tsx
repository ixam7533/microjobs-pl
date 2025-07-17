import { useState, useEffect } from 'react'
import Header from '../components/Header'
import MainFooter from '../components/MainFooter'
import AuthLayout from '../components/AuthLayout'

export default function Help() {
  return (
    <AuthLayout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Pomoc</h1>
            <div>
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Jak korzystać z MicroJobs?</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>MicroJobs to platforma łącząca osoby oferujące usługi z tymi, którzy ich potrzebują.</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Przeglądaj oferty w różnych kategoriach</li>
                  <li>Dodawaj własne ogłoszenia</li>
                  <li>Komunikuj się z klientami przez wbudowany chat</li>
                  <li>Oceniaj współpracę z innymi użytkownikami</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Często zadawane pytania</h2>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Jak dodać nowe ogłoszenie?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Kliknij "Dodaj ogłoszenie" w menu głównym i wypełnij formularz.</p>
                  
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Jak kontaktować się z oferentem?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Możesz wysłać email lub skorzystać z wbudowanego chatu.</p>
                  
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#666' }}>Jak promować swoją ofertę?</h3>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Skorzystaj z planu Pro, aby wyróżnić swoje ogłoszenia.</p>
                </div>
              </section>
              
              <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Kontakt z pomocą</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Jeśli masz pytania, skontaktuj się z nami:</p>
                <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Email: pomoc@microjobs.pl</li>
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
