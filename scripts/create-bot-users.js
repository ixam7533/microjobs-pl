const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const botUsers = [
  { email: 'jan@example.com', name: 'Jan Kowalski' },
  { email: 'anna@example.com', name: 'Anna Nowak' },
  { email: 'piotr@example.com', name: 'Piotr Wiśniewski' },
  { email: 'test1@example.com', name: 'Testowy Użytkownik 1' },
  { email: 'test2@example.com', name: 'Testowy Użytkownik 2' },
  { email: 'test3@example.com', name: 'Testowy Użytkownik 3' },
  { email: 'test4@example.com', name: 'Testowy Użytkownik 4' },
  { email: 'test5@example.com', name: 'Testowy Użytkownik 5' },
  { email: 'maria@example.com', name: 'Maria Kowalczyk' },
  { email: 'tomasz@example.com', name: 'Tomasz Jankowski' },
  { email: 'katarzyna@example.com', name: 'Katarzyna Zielińska' },
  { email: 'lukasz@example.com', name: 'Łukasz Szymański' },
  { email: 'agnieszka@example.com', name: 'Agnieszka Dąbrowska' },
  { email: 'marcin@example.com', name: 'Marcin Kozłowski' },
  { email: 'magdalena@example.com', name: 'Magdalena Mazur' },
  { email: 'krzysztof@example.com', name: 'Krzysztof Krawczyk' }
]

async function createBotUsers() {
  console.log('Tworzenie użytkowników-botów...')
  
  for (const user of botUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })
      
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            confirmed: true, // Boty są od razu potwierdzone
            hash: null // Boty nie mają hasła (nie mogą się logować)
          }
        })
        console.log(`✓ Utworzono użytkownika: ${user.name} (${user.email})`)
      } else {
        console.log(`- Użytkownik już istnieje: ${user.email}`)
      }
    } catch (error) {
      console.error(`✗ Błąd tworzenia użytkownika ${user.email}:`, error)
    }
  }
  
  console.log('\nGotowe! Użytkownicy-boty zostali utworzeni.')
}

createBotUsers()
  .catch(error => {
    console.error('Błąd skryptu:', error)
  })
  .finally(() => {
    prisma.$disconnect()
  })
