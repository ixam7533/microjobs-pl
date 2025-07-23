// components/PromoButtonSmall1.tsx - Mały przycisk promocji (0-100zł) za 4zł
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

interface PromoButtonSmall1Props {
  offerId?: number | string
  offerTitle?: string
  onPromotionStart?: () => void
}

export default function PromoButtonSmall1({ offerId, offerTitle = '', onPromotionStart }: PromoButtonSmall1Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

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
            id: '9710765637974', // ID produktu promocji za 4zł
            node: containerRef.current,
            moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20z%C5%82',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px"
                    }
                  },
                  button: {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    ":hover": {
                      "background-color": "#28a745"
                    },
                    "background-color": "#34c759",
                    ":focus": {
                      "background-color": "#28a745"
                    },
                    "border-radius": "10px",
                    "padding-left": "30px",
                    "padding-right": "30px"
                  },
                  quantityInput: {
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px"
                  }
                },
                contents: {
                  img: false,
                  title: false,
                  price: false
                },
                text: {
                  button: "Promuj za 4zł"
                },
                events: {
                  beforeInit: () => {
                    console.log('PromoButtonSmall1: Promocja rozpoczęta dla ogłoszenia', offerId)
                    onPromotionStart?.()
                  }
                }
              },
              productSet: {
                styles: {
                  products: {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px"
                    }
                  }
                }
              },
              modalProduct: {
                contents: {
                  img: false,
                  imgWithCarousel: true,
                  button: false,
                  buttonWithQuantity: true
                },
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  button: {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    ":hover": {
                      "background-color": "#28a745"
                    },
                    "background-color": "#34c759",
                    ":focus": {
                      "background-color": "#28a745"
                    },
                    "border-radius": "10px",
                    "padding-left": "30px",
                    "padding-right": "30px"
                  },
                  quantityInput: {
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px"
                  }
                },
                text: {
                  button: "Dodaj do koszyka"
                }
              },
              option: {},
              cart: {
                styles: {
                  button: {
                    "font-weight": "bold",
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    ":hover": {
                      "background-color": "#28a745"
                    },
                    "background-color": "#34c759",
                    ":focus": {
                      "background-color": "#28a745"
                    },
                    "border-radius": "10px"
                  }
                },
                text: {
                  total: "Suma częściowa",
                  button: "Checkout"
                }
              },
              toggle: {
                styles: {
                  toggle: {
                    "font-weight": "bold",
                    "background-color": "#34c759",
                    ":hover": {
                      "background-color": "#28a745"
                    },
                    ":focus": {
                      "background-color": "#28a745"
                    }
                  },
                  count: {
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
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ minHeight: '40px', minWidth: '120px' }}
    />
  )
}
