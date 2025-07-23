// components/PromoButtonSmall2.tsx - Mały przycisk promocji (101-300zł) za 9.99zł
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

interface PromoButtonSmall2Props {
  offerId?: number | string
  offerTitle?: string
  onPromotionStart?: () => void
}

export default function PromoButtonSmall2({ offerId, offerTitle = '', onPromotionStart }: PromoButtonSmall2Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  const handlePromotionStart = () => {
    onPromotionStart?.()
    console.log(`Rozpoczynam promocję ogłoszenia ${offerId}: ${offerTitle}`)
  }

  useEffect(() => {
    if (initializedRef.current) return
    
    const loadShopify = () => {
      const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
      
      if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          ShopifyBuyInit()
        } else {
          loadScript()
        }
      } else {
        loadScript()
      }

      function loadScript() {
        const script = document.createElement('script')
        script.async = true
        script.src = scriptURL
        const head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
        head.appendChild(script)
        script.onload = ShopifyBuyInit
      }

      function ShopifyBuyInit() {
        const client = window.ShopifyBuy.buildClient({
          domain: '3cusn0-tb.myshopify.com',
          storefrontAccessToken: '1c310fecfc50cafd83aa554bc311b949',
        })
        
        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('product', {
            id: '9710742577494', // ID produktu promocji za 9.99zł
            node: containerRef.current,
            moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20z%C5%82',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0",
                      "margin-bottom": "0px"
                    },
                    "text-align": "left"
                  },
                  button: {
                    "font-family": "Arial, sans-serif",
                    "font-size": "12px",
                    "padding-top": "8px",
                    "padding-bottom": "8px",
                    "color": "#ffffff",
                    ":hover": {
                      "color": "#ffffff",
                      "background-color": "#1e7e34"
                    },
                    "background-color": "#28a745",
                    ":focus": {
                      "background-color": "#1e7e34"
                    },
                    "border-radius": "6px",
                    "padding-left": "12px",
                    "padding-right": "12px"
                  }
                },
                contents: {
                  img: false,
                  title: false,
                  price: false
                },
                text: {
                  button: "Promuj za 9.99zł"
                },
                events: {
                  beforeInit: () => {
                    handlePromotionStart()
                  }
                }
              },
              cart: {
                styles: {
                  button: {
                    "font-family": "Arial, sans-serif",
                    "font-size": "14px",
                    "padding-top": "12px",
                    "padding-bottom": "12px",
                    "color": "#ffffff",
                    ":hover": {
                      "color": "#ffffff",
                      "background-color": "#1e7e34"
                    },
                    "background-color": "#28a745",
                    ":focus": {
                      "background-color": "#1e7e34"
                    },
                    "border-radius": "6px"
                  }
                }
              }
            }
          })
        })
      }
    }

    loadShopify()
    initializedRef.current = true
  }, [offerId])

  return <div ref={containerRef} />
}
