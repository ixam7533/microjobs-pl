// Test do sprawdzenia nieprzeczytanych wiadomości
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testUnreadMessages() {
  try {
    console.log('=== Test unread messages logic ===')
    
    // Znajdź użytkownika
    const testUser = await prisma.user.findFirst({
      where: { email: 'ixam7533@gmail.com' }
    })
    
    if (!testUser) {
      console.log('User not found')
      return
    }
    
    console.log('Testing for user:', testUser.email, 'ID:', testUser.id)
    
    // Znajdź wszystkie czaty użytkownika
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: testUser.id
          }
        }
      },
      include: {
        messages: {
          where: {
            senderId: { not: testUser.id } // Wiadomości NIE od tego użytkownika
          },
          orderBy: { createdAt: 'desc' }
        },
        participants: {
          include: {
            user: true
          }
        }
      }
    })
    
    console.log('Chats found:', chats.length)
    
    let totalUnread = 0
    chats.forEach((chat, index) => {
      console.log(`\nChat ${index + 1}:`)
      console.log('  Participants:', chat.participants.map(p => p.user.email))
      console.log('  Unread messages:', chat.messages.length)
      chat.messages.forEach(msg => {
        console.log(`    From other user: "${msg.content.substring(0, 50)}..."`)
      })
      totalUnread += chat.messages.length
    })
    
    console.log('\n=== TOTAL UNREAD:', totalUnread, '===')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUnreadMessages()
