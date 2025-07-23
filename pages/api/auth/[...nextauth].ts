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

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(params: any) {
      if (params.account) {
        params.token.accessToken = params.account.access_token
      }
      return params.token
    },
    async session(params: any) {
      params.session.accessToken = params.token.accessToken as string
      return params.session
    },
    async signIn(params: any) {
      // Zawsze pozwalaj na logowanie
      return true
    },
    async redirect({ url, baseUrl }: any) {
      // Po udanym logowaniu przekieruj na stronę główną
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // W przypadku błędu też przekieruj na login
  },
}

export default NextAuth(authOptions)
