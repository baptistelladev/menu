import { IClient } from "./IClient"
import { IDeliveryType } from "./IDeliveryType"
import { INeighborhood } from "./INeighborhood"
import { IPaymentMethod } from "./IPaymentMethod"
import { IProduct } from "./IProduct"
import { IProductFromOrder } from "./IProductFromOrder"

export interface IAppInfo {
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
