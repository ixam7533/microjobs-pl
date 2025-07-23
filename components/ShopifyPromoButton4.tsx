// components/ShopifyPromoButton4.tsx - Promocja za 4zł (0-100zł)
import React, { useEffect } from 'react'

interface ShopifyPromoButton4Props {
  offerId: number | string
}

export default function ShopifyPromoButton4({ offerId }: ShopifyPromoButton4Props) {
  const componentId = `shopify-promo-4-${offerId}`

  useEffect(() => {
    // Funkcja inicjalizująca Shopify
    const initShopify = () => {
      if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        ShopifyBuyInit()
      } else {
        loadScript()
      }
    }

    const loadScript = () => {
      if (document.getElementById('shopify-sdk')) {
        ShopifyBuyInit()
        return
      }

      const script = document.createElement('script')
      script.id = 'shopify-sdk'
      script.async = true
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
      document.head.appendChild(script)
      script.onload = ShopifyBuyInit
    }

    const ShopifyBuyInit = () => {
      const client = window.ShopifyBuy.buildClient({
        domain: '3cusn0-tb.myshopify.com',
        storefrontAccessToken: '1c310fecfc50cafd83aa554bc311b949',
      })

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        const node = document.getElementById(componentId)
        if (!node) return

        ui.createComponent('product', {
          id: '9716825588054',
          node: node,
          moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20z%C5%82',
          options: {
            "product": {
              "styles": {
                "product": {
                  "@media (min-width: 601px)": {
                    "max-width": "200px",
                    "margin-left": "0",
                    "margin-bottom": "10px"
                  }
                },
                "button": {
                  "font-weight": "bold",
                  "font-size": "12px",
                  "padding-top": "8px",
                  "padding-bottom": "8px",
                  ":hover": {
                    "background-color": "#0d8e48"
                  },
                  "background-color": "#0e9e50",
                  ":focus": {
                    "background-color": "#0d8e48"
                  },
                  "border-radius": "8px",
                  "padding-left": "10px",
                  "padding-right": "10px"
                }
              },
              "buttonDestination": "checkout",
              "contents": {
                "img": false,
                "title": false,
                "price": false
              },
              "text": {
                "button": "🚀 Promuj za 4zł"
              }
            }
          }
        })
      })
    }

    initShopify()
  }, [componentId])

  return <div id={componentId}></div>
}

// Rozszerzenie typu Window
declare global {
  interface Window {
    ShopifyBuy: any
  }
}
