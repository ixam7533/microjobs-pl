import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'

// Sprawdź czy mamy prawdziwe klucze OAuth (nie placeholdery)
const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && 
                     process.env.GOOGLE_CLIENT_SECRET && 
                     process.env.GOOGLE_CLIENT_ID !== 'twoj_google_client_id' &&
                     process.env.GOOGLE_CLIENT_SECRET !== 'twoj_google_client_secret'

const hasFacebookKeys = process.env.FACEBOOK_CLIENT_ID && 
                        process.env.FACEBOOK_CLIENT_SECRET && 
                        process.env.FACEBOOK_CLIENT_ID !== 'twoj_facebook_client_id' &&
                        process.env.FACEBOOK_CLIENT_SECRET !== 'twoj_facebook_client_secret'

const providers = []

if (hasGoogleKeys) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }))
}

if (hasFacebookKeys) {
  providers.push(FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  }))
}

console.log('NextAuth providers:', providers.map(p => p.id))

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
