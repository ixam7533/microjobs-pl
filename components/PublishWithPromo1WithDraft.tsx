// components/PublishWithPromo1WithDraft.tsx - Przycisk publikacji + promocji z zapisaniem draft
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

interface PublishWithPromo1WithDraftProps {
  offerData: any
  onDraftSaved?: (draftId: number) => void
}

export default function PublishWithPromo1WithDraft({ offerData, onDraftSaved }: PublishWithPromo1WithDraftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  const saveDraftFirst = async () => {
    try {
      console.log('Zapisuję draft ogłoszenia z promocją...', offerData)
      
      const response = await fetch('/api/offers/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          paymentType: 'publish_promo1',
          wantPromo: true,
          userEmail: offerData.contactEmail,
          userId: 1
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Draft z promocją zapisany:', result.draftId)
        onDraftSaved?.(result.draftId)
        
        // Po zapisaniu draft, pokaż przycisk Shopify
        initializeShopifyButton()
      } else {
        throw new Error(result.error || 'Błąd zapisywania draft')
      }
    } catch (error) {
      console.error('Błąd zapisywania draft:', error)
      alert('Błąd zapisywania ogłoszenia. Spróbuj ponownie.')
    }
  }

  const initializeShopifyButton = () => {
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
            id: '9717509292374',
            node: containerRef.current,
            moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20z%C5%82',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0",
                      "margin-bottom": "50px"
                    },
                    "text-align": "left"
                  },
                  button: {
                    "font-family": "Arial, sans-serif",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    "color": "#ffffff",
                    ":hover": {
                      "color": "#ffffff",
                      "background-color": "#9c4eda"
                    },
                    "background-color": "#0e9e50",
                    ":focus": {
                      "background-color": "#9c4eda"
                    },
                    "border-radius": "8px",
                    "padding-left": "24px",
                    "padding-right": "24px"
                  }
                },
                contents: {
                  img: false,
                  title: false,
                  price: false
                },
                text: {
                  button: "Publikuj + Promuj za 10 zł"
                }
              },
              cart: {
                styles: {
                  button: {
                    "font-family": "Arial, sans-serif",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    "color": "#ffffff",
                    ":hover": {
                      "color": "#ffffff",
                      "background-color": "#9c4eda"
                    },
                    "background-color": "#0e9e50",
                    ":focus": {
                      "background-color": "#9c4eda"
                    },
                    "border-radius": "8px"
                  }
                }
              }
            }
          })
        })
      }
    }
    
    loadShopify()
  }

  return (
    <div>
      <button
        type="button"
        onClick={saveDraftFirst}
        style={{
          backgroundColor: '#0e9e50',
          color: 'white',
          border: 'none',
          padding: '16px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        🚀 Zapisz i przejdź do płatności (10 zł)
      </button>
      
      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  )
}
