import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import prisma from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'
import { sendNotification } from '../../../../lib/email'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = await getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Zaloguj się' })

  try {
    const form = formidable({ 
      multiples: true,
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    // Upewnij się, że folder uploads istnieje
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Błąd parsowania formularza:', err)
        return res.status(500).json({ error: 'Błąd uploadu' })
      }

      try {
        console.log('Otrzymane pola:', fields)
        console.log('Otrzymane pliki:', files)

        // Wyciągnij dane z formularza
        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title || ''
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description || ''
        const price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price) || 0
        const category = Array.isArray(fields.category) ? fields.category[0] : fields.category || ''
        const subcategoriesStr = Array.isArray(fields.subcategories) ? fields.subcategories[0] : fields.subcategories || '[]'
        const subcategories = JSON.parse(subcategoriesStr)
        const location = Array.isArray(fields.location) ? fields.location[0] : fields.location || ''
        const contactName = Array.isArray(fields.contactName) ? fields.contactName[0] : fields.contactName || ''
        const contactEmail = Array.isArray(fields.contactEmail) ? fields.contactEmail[0] : fields.contactEmail || ''
        const contactPhone = Array.isArray(fields.contactPhone) ? fields.contactPhone[0] : fields.contactPhone || ''
        const offerType = Array.isArray(fields.offerType) ? fields.offerType[0] : fields.offerType || 'offer'
        const wantPromo = (Array.isArray(fields.wantPromo) ? fields.wantPromo[0] : fields.wantPromo) === 'true'

        console.log('Przetworzone dane:', { title, description, price, category, subcategories, location, contactName, contactEmail, contactPhone, offerType, wantPromo })

        // Obsługa zdjęć
        const imgPaths: string[] = []
        if (files.images) {
          const imageFiles = Array.isArray(files.images) ? files.images : [files.images]
          
          for (const file of imageFiles) {
            if (file && file.filepath) {
              try {
                const data = fs.readFileSync(file.filepath)
                const fileName = `${Date.now()}-${file.originalFilename || 'image.jpg'}`
                const dst = path.join(uploadsDir, fileName)
                fs.writeFileSync(dst, data)
                imgPaths.push(`/uploads/${fileName}`)
                
                // Usuń tymczasowy plik
                fs.unlinkSync(file.filepath)
              } catch (fileError) {
                console.error('Błąd przetwarzania pliku:', fileError)
              }
            }
          }
        }

        // Stwórz ogłoszenie w bazie danych
        console.log('Tworzenie ogłoszenia w bazie danych...')
        
        // Sprawdź czy ogłoszenie ma być promowane
        let promoted = false
        let promotedUntil = null
        let shouldUpdatePromotions = false
        
        if (wantPromo) {
          // Sprawdź czy użytkownik ma aktywną subskrypcję i dostępne promocje
          const userWithSubscription = await prisma.user.findUnique({
            where: { id: user.id }
          })
          
          if (userWithSubscription) {
            const now = new Date()
            const hasActiveSubscription = userWithSubscription.subscriptionEnd && userWithSubscription.subscriptionEnd > now
            
            if (hasActiveSubscription && userWithSubscription.promotionsUsed < userWithSubscription.promotionsLimit) {
              promoted = true
              promotedUntil = new Date()
              promotedUntil.setDate(promotedUntil.getDate() + 7) // 7 dni promocji
              shouldUpdatePromotions = true
            }
          }
        }
        
        const offer = await prisma.offer.create({
          data: {
            title,
            category,
            description: `${description}\n\nTyp: ${offerType === 'szukam_pracownika' ? 'Oferuję pracę' : 'Szukam pracy'}\nPodkategorie: ${subcategories.join(', ')}\nPromocja: ${wantPromo ? 'Tak' : 'Nie'}`,
            price,
            autorenew: true,
            location,
            contactName,
            contactEmail,
            contactPhone: contactPhone || null,
            offerType: offerType === 'szukam_pracownika' ? 'szukam_pracownika' : 'szukam_pracy',
            promoted,
            promotedUntil,
            owner: { connect: { id: user.id } },
            images: { 
              create: imgPaths.map(url => ({ url }))
            }
          },
          include: { 
            images: true,
            owner: true
          }
        })
        console.log('Ogłoszenie utworzone:', offer.id)
        
        // Aktualizuj licznik promocji jeśli ogłoszenie zostało promowane
        if (shouldUpdatePromotions) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              promotionsUsed: {
                increment: 1
              }
            }
          })
          
          // Stwórz rekord użycia promocji
          await prisma.promotionUsage.create({
            data: {
              userId: user.id,
              offerId: offer.id
            }
          })
          
          console.log('Licznik promocji zaktualizowany')
        }

        // Wyślij powiadomienie email
        try {
          await sendNotification({
            to: 'unlimitedcontentg@gmail.com',
            subject: `Nowe ogłoszenie #${offer.id} - ${title}`,
            text: `
Nowe ogłoszenie dodane przez: ${user.email}

Tytuł: ${title}
Kategoria: ${category}
Cena: ${price} zł
Lokalizacja: ${location}
Typ: ${offerType === 'offer' ? 'Oferuję pracę' : 'Szukam pracy'}
Podkategorie: ${subcategories.join(', ')}

Opis:
${description}

Kontakt:
Imię: ${contactName}
Email: ${contactEmail}
Telefon: ${contactPhone}

Link do ogłoszenia: http://localhost:3003/#offer-${offer.id}
            `.trim()
          })
        } catch (emailError) {
          console.error('Błąd wysyłania emaila:', emailError)
          // Nie przerywamy procesu jeśli email się nie wyśle
        }

        res.status(201).json({ 
          success: true,
          offer,
          message: 'Ogłoszenie zostało dodane pomyślnie!'
        })

      } catch (dbError) {
        console.error('Błąd bazy danych:', dbError)
        res.status(500).json({ error: 'Błąd zapisu do bazy danych' })
      }
    })

  } catch (error) {
    console.error('Błąd ogólny:', error)
    res.status(500).json({ error: 'Wystąpił nieoczekiwany błąd' })
  }
}
