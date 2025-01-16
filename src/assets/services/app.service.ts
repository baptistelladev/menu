import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { StorageService } from 'src/core/services/storage.service';
import { APP_INFO } from 'src/shared/consts/key';
import { DeliveryTypeEnum } from 'src/shared/enums/EnumDeliveryType';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IDeliveryType } from 'src/shared/interfaces/IDeliveryType';
import { INeighborhood } from 'src/shared/interfaces/INeighborhood';
import { IProduct } from 'src/shared/interfaces/IProduct';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import * as AppStore from 'src/shared/store/app/app.state';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private placeInfo = 'assets/json/placeInfo.json';

  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  constructor(
    private http : HttpClient,
    private store : Store,
    private modalCtrl : ModalController,
    private storageService : StorageService
  ) {
    this.getAppInfoFromNGRX();
  }

  /**
   * @description Obtém as informações do cliente guardado em JSON (simulando um serviço)
   * @returns um observable do tipo any que
   */
  public getAppInfo(): Observable<IAppInfo> {
    return this.http.get<any>(this.placeInfo);
  }

  /**
   * @description Obtém as informações do NGRX e separada nas sessões.
   * @author Felipe Baptistella.
   */
  public getAppInfoFromNGRX() {
    this.appInfo$ = this.store.select(AppStore.selectAppInfo);
    this.appInfoSubscription = this.appInfo$.subscribe( async (appInfo: IAppInfo) => {
      this.appInfo = {...appInfo};
    })
  }

  // DAQUI PARA BAIXO SÁO AS FUNÇÕES QUE TRABALHAM COM O CARRINHO.
  public async addProductToCart(product: IProductFromOrder) {
    let productSent: IProductFromOrder = product;

    this.store.dispatch(AppStore.addProductToCart({ product: productSent }));
  }

  /**
   * @description Faz a contagem de produtos dentro de produtos e define o total e aproveitando que essa é uma função que é sempre disparada nós aproveitamos para ficar definindo as informacoes na storage.
   * @observation Cada produto tem sua própria quantidade no carrinho, devemos passar por todos, somar todos e aí sim definir o total.
   * @author Felipe Baptistella.
   */
  public async setTotalProductsToCart() {
    const totalProducts = this.appInfo.cart?.products?.reduce((total: number, product: IProductFromOrder) => {
      return total + (product.quantity || 0); // Adiciona a quantidade ou 0 se estiver indefinido
    }, 0);

    this.store.dispatch(AppStore.setCartTotalProducts({ totalProducts: totalProducts ? totalProducts : 0 }));


    await this.setCartTotalPriceWithoutDelivery();

    if (this.appInfo.cart?.delivery_type?.value === DeliveryTypeEnum.DELIVERY && this.appInfo.cart?.freight?.value && this.appInfo.cart.totalPriceWithoutDelivery && this.appInfo.cart.delivery_type) {
      await this.setCartTotalPriceWithDelivery({
        delivery: this.appInfo.cart.delivery_type,
        freight: this.appInfo.cart?.freight,
        totalPriceWithoutDelivery: this.appInfo.cart?.totalPriceWithoutDelivery
      });
    }

    let appInfo: IAppInfo = {
      ...this.appInfo
    }

    this.storageService.setStorageKey(APP_INFO, JSON.stringify(appInfo));

  }

  /**
   * @description Soma os valores e define o valor do carrinho.
   * @author Felipe Baptistella.
   */
  public async setCartTotalPriceWithoutDelivery() {
    const totalPriceWithoutDelivery = this.appInfo.cart?.products?.reduce((total: number, product: IProductFromOrder) => {
      return total + (product.totalPrice || 0); // Adiciona a quantidade ou 0 se estiver indefinido
    }, 0);

    this.store.dispatch(AppStore.setCartTotalPriceWithoutDelivery({ totalPriceWithoutDelivery: totalPriceWithoutDelivery ? totalPriceWithoutDelivery : 0 }));

  }

  /**
   * @description Soma os valores e define o valor do carrinho.
   * @author Felipe Baptistella.
   */
  public async setCartTotalPriceWithDelivery(deliveryInfo: { delivery: IDeliveryType, freight: INeighborhood, totalPriceWithoutDelivery: number}) {
    this.store.dispatch(AppStore.setCartTotalPriceWithDeliveryAndFreightInfo({ deliveryInfo }));


    let appInfo: IAppInfo = {
      ...this.appInfo,
      cart: {
        ...this.appInfo.cart,
        delivery_type: deliveryInfo.delivery,
        freight: deliveryInfo.freight,
        totalPriceWithoutDelivery: deliveryInfo.totalPriceWithoutDelivery
      }
    }

    this.storageService.setStorageKey(APP_INFO, JSON.stringify(appInfo));
  }

  public async removeAppFromCart(product: IProductFromOrder): Promise<boolean> {
    this.store.dispatch(AppStore.removeItemFromCart({ product: product }));
    return true
  }
}
