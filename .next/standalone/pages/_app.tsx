// pages/_app.tsx

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import FacebookSDK from '../components/FacebookSDK'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3508998956815296"
          crossOrigin="anonymous"
        />
        <script async src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"></script>
      </Head>
      
      {/* Facebook SDK - używamy zmiennej środowiskowej lub placeholder */}
      <FacebookSDK 
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "twój_app_id_z_facebook"} 
        version="v18.0" 
      />
      
      <Component {...pageProps} />
    </SessionProvider>
  )
}
