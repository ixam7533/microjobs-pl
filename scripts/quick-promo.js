// scripts/quick-promo.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Dodaję promowane ogłoszenie...');

// Dodaj użytkownika PRO
const userQuery = `
INSERT OR REPLACE INTO User (
  id, email, name, confirmed, subscriptionType, subscriptionStart, 
  subscriptionEnd, promotionsUsed, promotionsLimit
) VALUES (
  1, 'jan.kowalski@promojobs.pl', 'Jan Kowalski', 1, 'PRO', 
  datetime('now'), datetime('now', '+30 days'), 0, 1
)`;

// Dodaj promowane ogłoszenie
const offerQuery = `
INSERT OR REPLACE INTO Offer (
  id, title, category, description, location, contactName, contactEmail, 
  contactPhone, price, offerType, promoted, promotedUntil, ownerId, 
  createdAt, updatedAt
) VALUES (
  1, '⭐ PILNE! Szukam grafika - atrakcyjne warunki!', 'IT i technologia',
  '🎨 SZUKAM GRAFIKA DO DŁUGOTERMINOWEJ WSPÓŁPRACY

💼 PROJEKT: E-commerce + branding
💰 STAWKA: 120-150 zł/godz
📍 LOKALIZACJA: Warszawa (możliwa praca zdalna)
⏰ START: Natychmiast

🔥 CO OFERUJEMY:
• Konkurencyjne wynagrodzenie
• Płatność w 24h
• Elastyczne godziny
• Nowoczesne narzędzia
• Przyjazny zespół

📋 TWOJE ZADANIA:
• Projekt logo i CI
• Grafiki produktowe
• Banery reklamowe
• Materiały print
• Optymalizacja web

✅ SZUKAMY KOGOŚ KTO:
• Ma min. 2 lata doświadczenia
• Zna Adobe Creative Suite
• Jest kreatywny i terminowy
• Posiada portfolio

💡 DLACZEGO MY:
• Startup o dużym potencjale
• Możliwość rozwoju
• Ciekawe wyzwania
• Stabilna współpraca

📞 Wyślij CV + portfolio już dziś!',
  'Warszawa, mazowieckie', 'Jan Kowalski', 'jan.kowalski@promojobs.pl',
  '+48 123 456 789', 135.00, 'szukam_pracownika', 1, 
  datetime('now', '+7 days'), 1, datetime('now'), datetime('now')
)`;

// Dodaj zwykłe ogłoszenia
const regularOffers = `
INSERT OR REPLACE INTO Offer (
  id, title, category, description, location, contactName, contactEmail, 
  price, offerType, promoted, ownerId, createdAt, updatedAt
) VALUES 
(2, 'Sprzątanie biur i domów', 'Dom i ogród', 'Oferuję profesjonalne sprzątanie. Własne środki.', 
 'Kraków, małopolskie', 'Anna Sprzątacz', 'anna@sprzatanie.pl', 25.00, 'szukam_pracy', 0, 1, datetime('now'), datetime('now')),
(3, 'Naprawa komputerów', 'IT i technologia', 'Serwis PC, instalacja, odzyskiwanie danych.', 
 'Wrocław, dolnośląskie', 'Piotr Serwis', 'piotr@serwis.pl', 80.00, 'szukam_pracy', 0, 1, datetime('now'), datetime('now')),
(4, 'Korepetycje matematyki', 'Edukacja', 'Korepetycje z matematyki dla uczniów liceum.', 
 'Gdańsk, pomorskie', 'Magdalena Nauczyciel', 'magdalena@korepetycje.pl', 40.00, 'szukam_pracy', 0, 1, datetime('now'), datetime('now'))
`;

db.serialize(() => {
  db.run(userQuery, (err) => {
    if (err) console.error('Błąd dodawania użytkownika:', err);
    else console.log('✅ Dodano użytkownika PRO');
  });

  db.run(offerQuery, (err) => {
    if (err) console.error('Błąd dodawania promowanego ogłoszenia:', err);
    else console.log('✅ Dodano promowane ogłoszenie');
  });

  db.run(regularOffers, (err) => {
    if (err) console.error('Błąd dodawania zwykłych ogłoszeń:', err);
    else console.log('✅ Dodano zwykłe ogłoszenia');
  });

  db.close((err) => {
    if (err) console.error('Błąd zamykania bazy:', err);
    else {
      console.log('\n🎉 GOTOWE!');
      console.log('🌐 Zobacz rezultat na: http://localhost:3000');
      console.log('💎 Promowane ogłoszenie ma złotą ramkę i gwiazdkę ⭐!');
    }
  });
});
