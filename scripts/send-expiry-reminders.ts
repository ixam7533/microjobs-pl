// scripts/send-expiry-reminders.ts
import prisma from '../lib/prisma'
import { sendReminderEmail } from '../lib/email'

export async function sendExpiryReminders() {
  const fourDaysFromNow = new Date()
  fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4)
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 5)

  try {
    // Find users whose subscriptions expire in 4 days
    const usersToRemind = await prisma.user.findMany({
      where: {
        subscriptionEnd: {
          gte: fourDaysFromNow,
          lt: tomorrow
        },
        emailReminder: true
      },
      select: {
        email: true,
        subscriptionEnd: true,
        subscriptionType: true
      }
    })

    console.log(`Found ${usersToRemind.length} users to remind`)

    for (const user of usersToRemind) {
      try {
        await sendReminderEmail(user.email, {
          subscriptionType: user.subscriptionType!,
          expiryDate: user.subscriptionEnd!
        })
        console.log(`Reminder sent to ${user.email}`)
      } catch (error) {
        console.error(`Failed to send reminder to ${user.email}:`, error)
      }
    }

    console.log('Reminder emails sent successfully')
  } catch (error) {
    console.error('Error sending reminder emails:', error)
  }
}

// Run if called directly
if (require.main === module) {
  sendExpiryReminders()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
