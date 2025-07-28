// components/PublishWithPromo1Direct.tsx - Przycisk promocji bezpośrednio do płatności
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

interface PublishWithPromo1DirectProps {
  offerData?: any
  onSuccess?: () => void
}

export default function PublishWithPromo1Direct({ offerData, onSuccess }: PublishWithPromo1DirectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializeShopifyButton()
      initializedRef.current = true
    }

    // Nasłuchuj na ukończenie zakupu
    const checkPurchaseCompletion = () => {
      const purchaseCompleted = localStorage.getItem('shopify_purchase_completed')
      if (purchaseCompleted === 'true') {
        localStorage.removeItem('shopify_purchase_completed')
        console.log('Zakup Shopify z promocją ukończony - odświeżam stronę')
        onSuccess?.()
      }
    }

    const interval = setInterval(checkPurchaseCompletion, 2000)
    return () => clearInterval(interval)
  }, [onSuccess])

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
            id: '9714008555862',
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
                  "button": "Zapisz i przejdź do płatności (10 zł)"
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
                  "total": "Subtotal",
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
      }
    }

    loadShopify()
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} />
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            localStorage.setItem('shopify_purchase_completed', 'true')
            alert('Test: Symulacja udanego zakupu z promocją')
          }}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            padding: '4px 8px',
            fontSize: '10px',
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          TEST
        </button>
      )}
    </div>
  )
}
