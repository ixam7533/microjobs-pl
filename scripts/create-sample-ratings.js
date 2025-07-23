const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sampleRatings = [
  {
    reviewerEmail: 'ixam7533@gmail.com',
    reviewedEmail: 'jan@example.com',
    rating: 5,
    comment: 'Doskonała praca! Bardzo polecam.'
  },
  {
    reviewerEmail: 'ixam7533@gmail.com', 
    reviewedEmail: 'anna@example.com',
    rating: 4,
    comment: 'Solidna robota, wszystko zgodnie z ustaleniami.'
  },
  {
    reviewerEmail: 'bibleversememory7@gmail.com',
    reviewedEmail: 'piotr@example.com',
    rating: 5,
    comment: 'Bardzo profesjonalne podejście, na czas i w dobrej cenie.'
  },
  {
    reviewerEmail: 'jan@example.com',
    reviewedEmail: 'ixam7533@gmail.com',
    rating: 4,
    comment: 'Miła współpraca, na pewno skorzystam ponownie.'
  },
  {
    reviewerEmail: 'anna@example.com',
    reviewedEmail: 'ixam7533@gmail.com', 
    rating: 5,
    comment: 'Wszystko perfekcyjnie zorganizowane!'
  },
  {
    reviewerEmail: 'piotr@example.com',
    reviewedEmail: 'bibleversememory7@gmail.com',
    rating: 4,
    comment: 'Dobra komunikacja i terminowość.'
  }
]

async function createSampleRatings() {
  console.log('Tworzenie przykładowych ocen...')
  
  for (const ratingData of sampleRatings) {
    try {
      // Znajdź użytkowników
      const reviewer = await prisma.user.findUnique({
        where: { email: ratingData.reviewerEmail }
      })
      
      const reviewed = await prisma.user.findUnique({
        where: { email: ratingData.reviewedEmail }
      })
      
      if (!reviewer || !reviewed) {
        console.log(`⚠ Pominięto - nie znaleziono użytkowników: ${ratingData.reviewerEmail} -> ${ratingData.reviewedEmail}`)
        continue
      }
      
      // Sprawdź czy ocena już istnieje
      const existingRating = await prisma.rating.findFirst({
        where: {
          reviewerId: reviewer.id,
          reviewedId: reviewed.id,
          offerId: null
        }
      })
      
      if (!existingRating) {
        await prisma.rating.create({
          data: {
            rating: ratingData.rating,
            comment: ratingData.comment,
            reviewerId: reviewer.id,
            reviewedId: reviewed.id,
            offerId: null
          }
        })
        console.log(`✓ Dodano ocenę: ${ratingData.reviewerEmail} -> ${ratingData.reviewedEmail} (${ratingData.rating}⭐)`)
      } else {
        console.log(`- Ocena już istnieje: ${ratingData.reviewerEmail} -> ${ratingData.reviewedEmail}`)
      }
    } catch (error) {
      console.error(`✗ Błąd tworzenia oceny:`, error)
    }
  }
  
  console.log('\nGotowe! Przykładowe oceny zostały utworzone.')
  
  // Pokaż statystyki
  const totalRatings = await prisma.rating.count()
  console.log(`\nStatystyki: ${totalRatings} ocen w systemie`)
}

createSampleRatings()
  .catch(error => {
    console.error('Błąd skryptu:', error)
  })
  .finally(() => {
    prisma.$disconnect()
  })
