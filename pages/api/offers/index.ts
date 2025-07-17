// pages/api/offers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getMiastaForWojewodztwo, normalizujNazweMiasta, alternatywneNazwyMiast, rozszerzoneWyszukiwanie } from 'lib/locations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { 
      maxPrice, 
      minPrice, 
      province, 
      city, 
      radius, 
      mainCat, 
      subCat, 
      sortBy, 
      search,
      offerType,
      page = '1',
      limit = '12'
    } = req.query

    const currentPage = parseInt(page as string)
    const itemsPerPage = parseInt(limit as string)
    const skip = (currentPage - 1) * itemsPerPage

    // Buduj warunki filtrowania
    const where: any = {}
    
    // Filtrowanie po cenie
    if (maxPrice || minPrice) {
      where.price = {}
      if (maxPrice) where.price.lte = parseInt(maxPrice as string)
      if (minPrice) where.price.gte = parseInt(minPrice as string)
    }
    
    // Filtrowanie po kategorii
    if (mainCat) {
      where.category = mainCat as string
    }
    
    // Filtrowanie po typie oferty
    if (offerType) {
      where.offerType = offerType as string
    }
    
    // Ulepszone filtrowanie po lokalizacji
    if (province || city) {
      const locationConditions: any[] = []
      
      if (province && !city) {
        // Tylko województwo - szukaj po nazwie województwa i wszystkich miastach z tego województwa
        locationConditions.push({ 
          location: { 
            contains: province as string,
            mode: 'insensitive'
          } 
        })
        
        const miasta = getMiastaForWojewodztwo(province as string)
        miasta.forEach(miasto => {
          locationConditions.push({ 
            location: { 
              contains: miasto,
              mode: 'insensitive'
            } 
          })
          
          // Dodaj także alternatywne nazwy miast
          const alternatywy = alternatywneNazwyMiast[miasto] || []
          alternatywy.forEach(alt => {
            locationConditions.push({ 
              location: { 
                contains: alt,
                mode: 'insensitive'
              } 
            })
          })
        })
      } else if (city && !province) {
        // Tylko miasto - szukaj elastycznie z rozszerzonym wyszukiwaniem
        const searchTerms = rozszerzoneWyszukiwanie(city as string)
        
        searchTerms.forEach(term => {
          locationConditions.push({ 
            location: { 
              contains: term,
              mode: 'insensitive'
            } 
          })
        })
        
      } else if (province && city) {
        // I województwo i miasto - sprawdź czy miasto należy do województwa
        const miasta = getMiastaForWojewodztwo(province as string)
        const normalizedCity = normalizujNazweMiasta(city as string)
        const cityLower = (city as string).toLowerCase()
        
        const cityInProvince = miasta.some(miasto => 
          miasto.toLowerCase().includes(cityLower) || 
          miasto.toLowerCase() === normalizedCity.toLowerCase()
        )
        
        if (cityInProvince) {
          locationConditions.push({ 
            location: { 
              contains: city as string,
              mode: 'insensitive'
            } 
          })
          
          if (normalizedCity !== city) {
            locationConditions.push({ 
              location: { 
                contains: normalizedCity,
                mode: 'insensitive'
              } 
            })
          }
        }
      }
      
      if (locationConditions.length > 0) {
        where.OR = locationConditions
      }
    }
    
    // Filtrowanie po wyszukiwanej frazie
    if (search) {
      const searchConditions = [
        { title: { contains: search as string } },
        { description: { contains: search as string } }
      ]
      
      // Jeśli już mamy warunki OR dla lokalizacji, połącz je
      if (where.OR) {
        where.AND = [
          { OR: where.OR }, // warunki lokalizacji
          { OR: searchConditions } // warunki wyszukiwania
        ]
        delete where.OR
      } else {
        where.OR = searchConditions
      }
    }

    // Sortowanie - promowane oferty zawsze na górze
    let orderBy: any = [
      { 
        promoted: 'desc' // Promowane oferty na początku
      },
      { 
        createdAt: 'desc' // Potem sortuj według daty
      }
    ]
    
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          orderBy = [
            { promoted: 'desc' },
            { createdAt: 'desc' }
          ]
          break
        case 'oldest':
          orderBy = [
            { promoted: 'desc' },
            { createdAt: 'asc' }
          ]
          break
        case 'price_low':
          orderBy = [
            { promoted: 'desc' },
            { price: 'asc' }
          ]
          break
        case 'price_high':
          orderBy = [
            { promoted: 'desc' },
            { price: 'desc' }
          ]
          break
        case 'title':
          orderBy = [
            { promoted: 'desc' },
            { title: 'asc' }
          ]
          break
        default:
          orderBy = [
            { promoted: 'desc' },
            { createdAt: 'desc' }
          ]
      }
    }

    // Pobierz ogłoszenia z paginacją
    const [offers, totalCount] = await Promise.all([
      prisma.offer.findMany({ 
        where,
        orderBy,
        skip,
        take: itemsPerPage,
        include: {
          images: {
            orderBy: { id: 'asc' }
          }
        }
      }),
      prisma.offer.count({ where })
    ])
    
    // Mapuj oferety z obrazami i statusem promocji
    const now = new Date()
    const offersWithImages = offers.map(offer => ({
      ...offer,
      image: offer.images.length > 0 ? offer.images[0].url : '/house4k.jpg', // pierwsza dla kompatybilności
      images: offer.images.map(img => img.url), // wszystkie zdjęcia jako tablica
      isPromoted: offer.promoted && offer.promotedUntil && offer.promotedUntil > now // sprawdź czy promocja jest aktywna
    }))
    
    // Oblicz informacje o paginacji
    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1
    
    return res.status(200).json({
      offers: offersWithImages,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        itemsPerPage,
        hasNextPage,
        hasPrevPage
      }
    })
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).end()
}
