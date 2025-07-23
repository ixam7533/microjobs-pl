// Test notification dla cos@example.com
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createTestMessageForCos() {
  try {
    console.log('=== Creating test message for cos@example.com ===')
    
    // Znajdź użytkowników
    const cosUser = await prisma.user.findFirst({
      where: { email: 'cos@example.com' }
    })
    
    const otherUser = await prisma.user.findFirst({
      where: { email: { not: 'cos@example.com' } }
    })
    
    if (!cosUser || !otherUser) {
      console.log('Users not found:', { cosUser: !!cosUser, otherUser: !!otherUser })
      return
    }
    
    console.log('Users found:', cosUser.email, 'and', otherUser.email)
    
    // Znajdź lub utwórz czat
    let chat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: [cosUser.id, otherUser.id] }
          }
        }
      }
    })
    
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              { userId: cosUser.id },
              { userId: otherUser.id }
            ]
          }
        }
      })
      console.log('Created new chat:', chat.id)
    }
    
    // Utwórz wiadomość od other user do cos@example.com
    const message = await prisma.message.create({
      data: {
        content: 'Test message for cos@example.com - ' + Date.now(),
        senderId: otherUser.id, // From other user
        chatId: chat.id
      }
    })
    
    console.log('Created test message:', message.id)
    console.log('Message from:', otherUser.email, 'to:', cosUser.email)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestMessageForCos()
