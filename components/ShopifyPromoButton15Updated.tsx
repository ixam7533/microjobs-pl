// components/ShopifyPromoButton15Updated.tsx - Promocja za 15zł (201-1000zł) z KOMPLETNYM kodem
import React, { useEffect } from 'react'

interface ShopifyPromoButton15Props {
  offerId?: number | string
}

export default function ShopifyPromoButton15Updated({ offerId }: ShopifyPromoButton15Props) {
  const componentId = `shopify-promo-15-updated-${offerId}`

  useEffect(() => {
    // Funkcja inicjalizująca Shopify z kompletnym kodem
    const initShopify = () => {
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
            id: '9716874903894',
            node: document.getElementById(componentId),
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
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px",
                    ":hover": {
                      "background-color": "#0d8e48"
                    },
                    "background-color": "#0e9e50",
                    ":focus": {
                      "background-color": "#0d8e48"
                    },
                    "border-radius": "10px",
                    "padding-left": "2px",
                    "padding-right": "2px"
                  },
                  "quantityInput": {
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px"
                  }
                },
                "buttonDestination": "checkout",
                "contents": {
                  "img": false,
                  "title": false,
                  "price": false
                },
                "text": {
                  "button": "Buy now"
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
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px",
                    ":hover": {
                      "background-color": "#0d8e48"
                    },
                    "background-color": "#0e9e50",
                    ":focus": {
                      "background-color": "#0d8e48"
                    },
                    "border-radius": "10px",
                    "padding-left": "2px",
                    "padding-right": "2px"
                  },
                  "quantityInput": {
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px"
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
                    "font-size": "14px",
                    "padding-top": "15px",
                    "padding-bottom": "15px",
                    ":hover": {
                      "background-color": "#0d8e48"
                    },
                    "background-color": "#0e9e50",
                    ":focus": {
                      "background-color": "#0d8e48"
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
                    "background-color": "#0e9e50",
                    ":hover": {
                      "background-color": "#0d8e48"
                    },
                    ":focus": {
                      "background-color": "#0d8e48"
                    }
                  },
                  "count": {
                    "font-size": "14px"
                  }
                }
              }
            },
          })
        })
      }
    }

    initShopify()
  }, [componentId])

  return (
    <div>
      <div id={componentId}></div>
    </div>
  )
}

// Rozszerzenie typu Window
declare global {
  interface Window {
    ShopifyBuy: any
  }
}
