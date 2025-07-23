// pages/api/offers/save-draft.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      offerType,
      title,
      description,
      price,
      category,
      subcategories,
      location,
      contactName,
      contactEmail,
      contactPhone,
      wantPromo,
      userEmail,
      paymentType, // 'publish' or 'publish_promo'
      userId
    } = req.body

    // Zapisz ogłoszenie z dodatkowym polem do śledzenia stanu płatności
    const draftOffer = await prisma.offer.create({
      data: {
        offerType,
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        location,
        contactName,
        contactEmail,
        contactPhone: contactPhone || '',
        ownerId: userId || 1, // Użyj userId z parametrów lub fallback na 1
        // Dodajemy custom pola do description jako JSON dla przechowania metadanych
        autorenew: false, // Nowe ogłoszenia nie są auto-odnawiane
        promoted: false,  // Dopiero po płatności za promocję
      }
    })

    // Wyślij email do admina o nowym draft
    const adminNotification = {
      to: 'admin@microjobs.pl', // Zmień na swój email
      subject: `Nowy draft ogłoszenia - ${title}`,
      html: `
        <h2>Nowe ogłoszenie czeka na opłacenie</h2>
        <p><strong>ID:</strong> ${draftOffer.id}</p>
        <p><strong>Tytuł:</strong> ${title}</p>
        <p><strong>Email użytkownika:</strong> ${userEmail}</p>
        <p><strong>Email kontaktowy:</strong> ${contactEmail}</p>
        <p><strong>Typ płatności:</strong> ${paymentType}</p>
        <p><strong>Cena ogłoszenia:</strong> ${price} zł</p>
        <p><strong>Promocja:</strong> ${wantPromo ? 'TAK' : 'NIE'}</p>
        <p><strong>Podkategorie:</strong> ${JSON.stringify(subcategories)}</p>
        
        <h3>Akcje:</h3>
        <p>Po otrzymaniu płatności Shopify, ręcznie zmień status ogłoszenia:</p>
        
        <h3>SQL do aktywacji zwykłego ogłoszenia:</h3>
        <code>
        UPDATE "Offer" SET promoted = false WHERE id = ${draftOffer.id};
        </code>
        
        <h3>SQL do aktywacji z promocją:</h3>
        <code>
        UPDATE "Offer" SET promoted = true, promotedUntil = datetime('now', '+7 days') WHERE id = ${draftOffer.id};
        </code>
      `
    }

    // Tu możesz dodać wysyłanie emaila - na razie tylko logujemy
    console.log('Admin notification:', adminNotification)

    res.status(200).json({ 
      success: true, 
      draftId: draftOffer.id,
      message: 'Ogłoszenie zapisane jako draft. Po opłaceniu zostanie opublikowane.' 
    })

  } catch (error) {
    console.error('Error saving draft:', error)
    res.status(500).json({ error: 'Błąd zapisywania ogłoszenia' })
  }
}
