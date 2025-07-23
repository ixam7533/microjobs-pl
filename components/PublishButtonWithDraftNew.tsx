// components/PublishButtonWithDraftNew.tsx - Przycisk publikacji z zapisaniem draft
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

interface PublishButtonWithDraftProps {
  offerData: any
  onDraftSaved?: (draftId: number) => void
}

export default function PublishButtonWithDraftNew({ offerData, onDraftSaved }: PublishButtonWithDraftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  const saveDraftFirst = async () => {
    try {
      console.log('Zapisuję draft ogłoszenia...', offerData)
      
      const response = await fetch('/api/offers/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          paymentType: 'publish',
          userEmail: offerData.contactEmail, // Tymczasowo używamy email z formularza
          userId: 1 // Tymczasowo - w prawdziwej app pobierz z sesji
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Draft zapisany:', result.draftId)
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
            id: '9714024743254',
            node: containerRef.current,
            moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20z%C5%82',
            options: {
              "product": {
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px"
                    }
                  },
                  "button": {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    "color": "#ffffff !important",
                    ":hover": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "background-color": "#b359f9",
                    ":focus": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "border-radius": "10px",
                    "padding-left": "90px",
                    "padding-right": "90px"
                  },
                  "quantityInput": {
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px"
                  }
                },
                "buttonDestination": "checkout",
                "contents": {
                  "img": false,
                  "title": false,
                  "price": false
                },
                "text": {
                  "button": "Publikuj za 6 zł"
                }
              },
              "productSet": {
                "styles": {
                  "products": {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px"
                    }
                  }
                }
              },
              "modalProduct": {
                "contents": {
                  "img": false,
                  "imgWithCarousel": true,
                  "button": false,
                  "buttonWithQuantity": true
                },
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  "button": {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    "color": "#ffffff !important",
                    ":hover": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "background-color": "#b359f9",
                    ":focus": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "border-radius": "10px",
                    "padding-left": "90px",
                    "padding-right": "90px"
                  },
                  "quantityInput": {
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px"
                  }
                },
                "text": {
                  "button": "Add to cart"
                }
              },
              "option": {},
              "cart": {
                "styles": {
                  "button": {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    "color": "#ffffff !important",
                    ":hover": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "background-color": "#b359f9",
                    ":focus": {
                      "background-color": "#a150e0",
                      "color": "#ffffff !important"
                    },
                    "border-radius": "10px"
                  }
                },
                "text": {
                  "total": "Suma częściowa",
                  "button": "Checkout"
                }
              },
              "toggle": {
                "styles": {
                  "toggle": {
                    "font-weight": "bold",
                    "background-color": "#b359f9",
                    ":hover": {
                      "background-color": "#a150e0"
                    },
                    ":focus": {
                      "background-color": "#a150e0"
                    }
                  },
                  "count": {
                    "font-size": "16px"
                  }
                }
              }
            }
          })
        })
        initializedRef.current = true
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
          backgroundColor: '#b359f9',
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
        📝 Zapisz i przejdź do płatności (6 zł)
      </button>
      
      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  )
}
