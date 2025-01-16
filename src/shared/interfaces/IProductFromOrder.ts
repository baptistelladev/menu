import { IProduct } from "./IProduct";

export interface IProductFromOrder extends IProduct {
  obs: string,
  quantity: number,
  totalPrice: number
}
