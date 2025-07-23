// Test script do utworzenia testowej wiadomości
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createTestMessage() {
  try {
    // Znajdź dwóch użytkowników
    const users = await prisma.user.findMany({
      take: 2
    })
    
    if (users.length < 2) {
      console.log('Potrzeba co najmniej 2 użytkowników do testu')
      return
    }
    
    console.log('Found users:', users.map(u => u.email))
    
    // Znajdź lub utwórz czat
    let chat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: [users[0].id, users[1].id] }
          }
        }
      }
    })
    
    if (!chat) {
      // Utwórz nowy czat
      chat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              { userId: users[0].id },
              { userId: users[1].id }
            ]
          }
        }
      })
      console.log('Created new chat:', chat.id)
    }
    
    // Utwórz testową wiadomość
    const message = await prisma.message.create({
      data: {
        content: 'Test notification message ' + Date.now(),
        senderId: users[0].id,
        chatId: chat.id
      }
    })
    
    console.log('Created test message:', message.id)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestMessage()
