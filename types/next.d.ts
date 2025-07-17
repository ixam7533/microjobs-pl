// types/next.d.ts
import 'next'

declare module 'next' {
  interface NextApiRequest {
    user?: { id: number; email: string; isAdmin?: boolean }
  }
}
