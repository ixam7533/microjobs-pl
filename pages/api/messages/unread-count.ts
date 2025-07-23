// pages/api/messages/unread-count.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 Unread count API called');
    
    // Pobierz token z ciasteczka
    const token = req.cookies.token;
    console.log('🔔 Token present:', !!token);
    
    if (!token) {
      console.log('🔔 No token found');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Zweryfikuj token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('🔔 Decoded token:', decoded);
    
    const userId = decoded.userId || decoded.id;
    console.log('🔔 User ID:', userId);

    if (!userId) {
      console.log('🔔 Invalid token - no userId');
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Znajdź wszystkie czaty użytkownika
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        messages: {
          where: {
            // Nieprzeczytane wiadomości to te, gdzie:
            // - użytkownik nie jest nadawcą
            senderId: { not: userId }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Policz wszystkie nieprzeczytane wiadomości
    const unreadCount = chats.reduce((total: number, chat: any) => {
      return total + chat.messages.length;
    }, 0);

    console.log('🔔 Total unread count:', unreadCount);
    console.log('🔔 Chats found:', chats.length);

    return res.status(200).json({ unreadCount });

  } catch (error) {
    console.error('🔔 Error fetching unread messages count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
