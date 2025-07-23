// components/PublishButton.tsx - Przycisk publikacji za 6zł (bez promocji)
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ShopifyBuy: any
  }
}

export default function PublishButton() {
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
            id: '9714024743254',
            node: document.getElementById('product-component-publish'),
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
                      "background-color": "#2e7d32"
                    },
                    "background-color": "#4caf50",
                    ":focus": {
                      "background-color": "#2e7d32"
                    },
                    "border-radius": "10px",
                    "padding-left": "90px",
                    "padding-right": "90px"
                  },
                  quantityInput: {
                    "font-size": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px"
                  }
                },
                buttonDestination: "checkout",
                contents: {
                  img: false,
                  title: false,
                  price: false
                },
                text: {
                  button: "Opublikuj za 6zł"
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
                      "background-color": "#2e7d32"
                    },
                    "background-color": "#4caf50",
                    ":focus": {
                      "background-color": "#2e7d32"
                    },
                    "border-radius": "10px",
                    "padding-left": "90px",
                    "padding-right": "90px"
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
                      "background-color": "#2e7d32"
                    },
                    "background-color": "#4caf50",
                    ":focus": {
                      "background-color": "#2e7d32"
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
                    "background-color": "#4caf50",
                    ":hover": {
                      "background-color": "#2e7d32"
                    },
                    ":focus": {
                      "background-color": "#2e7d32"
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
      id="product-component-publish" 
      ref={containerRef} 
      style={{ textAlign: 'center' }}
    />
  )
}
