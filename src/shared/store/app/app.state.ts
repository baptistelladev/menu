import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from "@ngrx/store"
import { IAppInfo } from "src/shared/interfaces/IAppInfo"
import { IClient } from "src/shared/interfaces/IClient"
import { IDeliveryType } from "src/shared/interfaces/IDeliveryType"
import { INeighborhood } from "src/shared/interfaces/INeighborhood"
import { IPaymentMethod } from "src/shared/interfaces/IPaymentMethod"
import { IProduct } from "src/shared/interfaces/IProduct"
import { IProductFromOrder } from "src/shared/interfaces/IProductFromOrder"

export interface IAppState {
  name: string,
  document: string,
  phone: string,
  logoPath: string,
  specialty: string,
  address: {
    street : string,
    number : string,
    neighborhood : string,
    complement : string,
    city : string,
    reference : string
  },
  products: IProduct[],
  cart?: {
    products?: IProductFromOrder[],
    totalProducts?: number,
    totalPriceWithoutDelivery?: number,
    totalPriceWithDelivery?: number,
    freight?: INeighborhood,
    delivery_type?: IDeliveryType,
    client?: IClient,
    payment?: {
      method?: IPaymentMethod,
      change?: number | null
    }
  },
  neighborhoods: INeighborhood[]
}

export const appInitialState: IAppState = {
  name: '',
  document: '',
  phone: '',
  logoPath: '',
  specialty: '',
  address: {
    street : '',
    number : '',
    neighborhood : '',
    complement : '',
    city : '',
    reference : ''
  },
  products: [],
  cart: {
    payment: {
      method: {
        text: '',
        value: ''
      },
      change: null
    },
    products: [],
    totalProducts: 0,
    totalPriceWithoutDelivery: 0,
    totalPriceWithDelivery: 0,
    freight: {
      name: '',
      price: 0,
      value: ''
    },
    delivery_type: {
      text: '',
      value: '',
    },
    client: {
      name: '',
      document: '',
      phone: '',
      address: {
        street : '',
        number : '',
        neighborhood : '',
        complement : '',
        city : '',
        reference : ''
      }
    }
  },
  neighborhoods: []
}

// ACTIONS
export const setAppAllInfo = createAction(
  '[APP] Definir informações do app',
  props<{ appInfo: IAppInfo }>()
)

export const setCartTotalProducts = createAction(
  '[CART] Definir total de produtos do carrinho',
  props<{ totalProducts: number }>()
)

export const addProductToCart = createAction(
  '[CART] Adicionar carrinho no produto',
  props<{ product: IProductFromOrder }>()
)

export const setCartTotalPriceWithoutDelivery = createAction(
  '[CART] Definir total financeiro dos produtos',
  props<{ totalPriceWithoutDelivery: number }>()
)

export const setCartTotalPriceWithDeliveryAndFreightInfo = createAction(
  '[CART] Definir total financeiro dos produtos + frete',
  props<{ deliveryInfo: { delivery: IDeliveryType, freight: INeighborhood, totalPriceWithoutDelivery: number } }>()
)

export const removeItemFromCart = createAction(
  '[CART] Remover produto do carrinho',
  props<{ product: IProductFromOrder }>()
)

export const increaseProduct = createAction(
  '[CART] Incluir produto',
  props<{ product: IProductFromOrder }>()
)

export const decreaseProduct = createAction(
  '[CART] Subtrair produto',
  props<{ product: IProductFromOrder }>()
)

export const setClient = createAction(
  '[CLIENT] Definir cliente',
  props<{ client: IClient }>()
)

export const setPaymentMethodAndChange = createAction(
  '[PAGAMENTO] Definir forma de pagamento e troco se necessário',
  props<{ paymentInfo: { method: IPaymentMethod, change?: number | null } }>()
)

// REDUCERS
export const appReducer = createReducer(
  appInitialState,
  on(
    setAppAllInfo,
    (state, { appInfo }): IAppState => ({
      ...state,
      name: appInfo.name,
      phone: appInfo.phone,
      document: appInfo.document,
      logoPath: appInfo.logoPath,
      specialty: appInfo.specialty,
      address: appInfo.address,
      products: appInfo.products,
      neighborhoods: appInfo.neighborhoods,
      cart: appInfo.cart
    })
  ),
  on(
    setCartTotalProducts,
    (state, { totalProducts }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        totalProducts: totalProducts
      }
    })
  ),
  on(
    addProductToCart,
    (state, { product }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        products: [...(state.cart?.products || [])].concat(product)
      }
    })
  ),
  on(
    setCartTotalPriceWithoutDelivery,
    (state, { totalPriceWithoutDelivery }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        totalPriceWithoutDelivery: totalPriceWithoutDelivery,
        totalPriceWithDelivery: totalPriceWithoutDelivery // CASO SEJA DELIVERY NOS JA DEFINIMOS AQUI PRA DEPOIS SO ADICIONAR O FRETE DA ENTREGA.
      }
    })
  ),
  on(
    setCartTotalPriceWithDeliveryAndFreightInfo,
    (state, { deliveryInfo }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        totalPriceWithDelivery: deliveryInfo.totalPriceWithoutDelivery + deliveryInfo.freight.price,
        delivery_type: deliveryInfo.delivery,
        freight: deliveryInfo.freight,
      }
    })
  ),
  on(
    removeItemFromCart,
    (state, { product }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        products: [...state.cart?.products || []].filter(productsInsideCart => productsInsideCart.id !== product.id)
      }
    })
  ),
  on(
    increaseProduct,
    (state, { product }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        products: state.cart?.products?.map((productInsideCart: IProductFromOrder) => {
          if (productInsideCart.id === product.id) {
            const newQuantity = Number(productInsideCart.quantity) + 1;

            return {
              ...productInsideCart,
              quantity: newQuantity,
              totalPrice: newQuantity * Number(productInsideCart.price)
            };
          } else {
            return productInsideCart;
          }
        })
      }
    })
  ),
  on(
    decreaseProduct,
    (state, { product }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        products: state.cart?.products?.map((productInsideCart: IProductFromOrder) => {
          if (productInsideCart.id === product.id) {
            const newQuantity = Number(productInsideCart.quantity) - 1;

            return {
              ...productInsideCart,
              quantity: newQuantity,
              totalPrice: newQuantity * Number(productInsideCart.price)
            };
          } else {
            return productInsideCart;
          }
        })
      }
    })
  ),
  on(
    setClient,
    (state, { client }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        client: client
      }
    })
  ),
  on(
    setPaymentMethodAndChange,
    (state, { paymentInfo }): IAppState => ({
      ...state,
      cart: {
        ...state.cart,
        payment: {
         method: paymentInfo.method,
         change: paymentInfo.change
        }
      }
    })
  ),
)

// SELETORES
export const selectAppState = createFeatureSelector<IAppState>('app');

export const selectAppInfo = createSelector(
  selectAppState,
  (state: IAppState) => state
);

export const selectCartTotalProducts = createSelector(
  selectAppState,
  (state: IAppState) => state.cart?.totalProducts
);

export const selectCartClient = createSelector(
  selectAppState,
  (state: IAppState) => state.cart?.client
);
