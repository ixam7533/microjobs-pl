import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyToken } from '../../../../lib/jwt'
import prisma from '../../../../lib/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const chatId = parseInt(id as string)

  if (!chatId) {
    return res.status(400).json({ error: 'Invalid chat ID' })
  }

  try {
    // Verify user authentication
    const authToken = req.cookies.token
    if (!authToken) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const payload = verifyToken(authToken)
    if (!payload || typeof payload === 'string' || !payload.id) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const userId = payload.id

    // Check if user has access to this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: { userId: userId }
        }
      }
    })

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or access denied' })
    }

    // Parse the uploaded file
    const form = new IncomingForm({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('File upload error:', err)
        return res.status(500).json({ error: 'File upload failed' })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // Check if it's an image
      if (!file.mimetype?.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed' })
      }

      try {
        // Create the uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadDir, { recursive: true })

        // Generate a unique filename
        const fileExtension = path.extname(file.originalFilename || '')
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`
        const filePath = path.join(uploadDir, fileName)

        // Move the file to the uploads directory
        await fs.rename(file.filepath, filePath)

        // Save message to database
        const message = await prisma.message.create({
          data: {
            content: `[IMAGE: /uploads/${fileName}]`,
            senderId: userId,
            chatId: chatId,
          }
        })

        // Return the new message
        const newMsg = {
          id: message.id,
          text: message.content,
          fromMe: true,
        }

        return res.status(200).json(newMsg)

      } catch (error) {
        console.error('Database error:', error)
        return res.status(500).json({ error: 'Failed to save message' })
      }
    })

  } catch (error) {
    console.error('Upload handler error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
