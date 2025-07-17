import type { NextApiRequest, NextApiResponse } from 'next'
interface Offer {
  id: number;
  ownerEmail: string;
  image: string;
  title: string;
  price: string;
  location: string;
}

const demoOffers: Offer[] = [
  {
    id: 1,
    ownerEmail: 'jan@przyklad.pl',
    image: '/mower.jpg',
    title: 'Koszenie trawy',
    price: '50 zł',
    location: 'Zabrze, śląskie',
  },
  {
    id: 2,
    ownerEmail: 'ala@przyklad.pl',
    image: '/carwash.jpg',
    title: 'Mycie auta',
    price: '40 zł',
    location: 'Gliwice, śląskie',
  },
  {
    id: 3,
    ownerEmail: 'jan@przyklad.pl',
    image: '/painting.jpg',
    title: 'Malowanie ogrodzenia',
    price: '100 zł',
    location: 'Katowice, śląskie',
  },
  {
    id: 4,
    ownerEmail: 'maria@przyklad.pl',
    image: '/cleaning.jpg',
    title: 'Sprzątanie domu',
    price: '80 zł',
    location: 'Warszawa, mazowieckie',
  },
  {
    id: 5,
    ownerEmail: 'tomek@przyklad.pl',
    image: '/transport.jpg',
    title: 'Transport mebli',
    price: '120 zł',
    location: 'Kraków, małopolskie',
  },
  {
    id: 6,
    ownerEmail: 'anna@przyklad.pl',
    image: '/garden.jpg',
    title: 'Pielęgnacja ogrodu',
    price: '60 zł',
    location: 'Gdańsk, pomorskie',
  },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Offer[]>,
) {
  res.status(200).json(demoOffers)
}
