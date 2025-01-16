import { MONEY_MASK } from './../../../shared/consts/masks';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppService } from 'src/assets/services/app.service';
import { StorageService } from 'src/core/services/storage.service';
import { APP_INFO } from 'src/shared/consts/key';
import { DeliveryTypeEnum } from 'src/shared/enums/EnumDeliveryType';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IDeliveryType } from 'src/shared/interfaces/IDeliveryType';
import { INeighborhood } from 'src/shared/interfaces/INeighborhood';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import { MOCK_DELIVERY_TYPE } from 'src/shared/mocks/MockDeliveryType';
import * as AppStore from 'src/shared/store/app/app.state';
import { IPaymentMethod } from 'src/shared/interfaces/IPaymentMethod';
import { MOCK_PAYMENT_METHODS } from 'src/shared/mocks/MockPaymentMethod';
import { PaymentMethodEnum } from 'src/shared/enums/EnumPaymentMethod';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  providers: [CurrencyPipe]
})
export class CartPage implements OnInit {

  // ISSO É O QUE PERMITE O MASKITO APLICAR A MÁSCARA NO FORMULÁRIO DO HTML E NÃO ION-INPUT.
  readonly maskPredicate: MaskitoElementPredicate = async (el: any) => (el as HTMLIonInputElement).getInputElement();

  readonly MONEY_MASK: MaskitoOptions = MONEY_MASK;

  public MOCK_DELIVERY_TYPE: IDeliveryType[] = [...MOCK_DELIVERY_TYPE];
  public MOCK_PAYMENT_METHODS: IPaymentMethod[] = [...MOCK_PAYMENT_METHODS];

  public changeForPayment: number | null;

  public selectedPaymentMethod: IPaymentMethod;
  public selectedPaymentMethodUsedInSelect: PaymentMethodEnum;

  public selectedDeliveryType: IDeliveryType;
  public selectedDeliveryTypeUsedInSelect: DeliveryTypeEnum;

  public selectedNeighborhood: INeighborhood;
  public selectedNeighborhoodUsedInSelect: any;

  public DeliveryTypeEnum = DeliveryTypeEnum;
  public PaymentMethodEnum = PaymentMethodEnum;

  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  constructor(
     private navCtrl : NavController,
     private store : Store,
     private appService : AppService,
     private storageService : StorageService,
     private alertCtrl : AlertController,
     private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit() {
    this.getAppInfoFromNGRX();
  }

  /**
   * @description Direcionar o usuário para a tela principal.
   * @author Felipe Baptistella
   */
  public goToHomePage(): void {
    this.navCtrl.navigateRoot(['app'])
  }

  /**
   * @description Obtém as informações do NGRX e separada nas sessões.
   * @author Felipe Baptistella.
   */
  public getAppInfoFromNGRX(): void {
    this.appInfo$ = this.store.select(AppStore.selectAppInfo);
    this.appInfoSubscription = this.appInfo$.subscribe( async (appInfo: IAppInfo) => {
      this.appInfo = appInfo;
      this.fillVariables(this.appInfo);
    })
  }

  /**
   * @description Disparado sempre que o tipo de entrega for acionado/trocado. Aproveitamos esse select para
   * @author Felipe Baptistella.
   */
  public deliveryTypeChanged(e: any) {

    let deliveryTypeFound = this.MOCK_DELIVERY_TYPE
    .find((type: IDeliveryType) => {
      return type.value === e.detail.value;
    })

    if (deliveryTypeFound) {
      this.selectedDeliveryType = deliveryTypeFound;

      // SE FOR RETIRAR NO LOCAL PRECISAMOS APAGAR O BAIRRO SELECIONADO NA TELA E NO NGRX.
      if (deliveryTypeFound.value === DeliveryTypeEnum.PICK_UP) {
        this.selectedNeighborhood = {
          name: '',
          price: 0,
          value: ''
        };

        this.selectedNeighborhoodUsedInSelect = '';

        this.appService.setCartTotalPriceWithDelivery({
          delivery: this.selectedDeliveryType,
          freight: this.selectedNeighborhood,
          totalPriceWithoutDelivery: this.appInfo.cart?.totalPriceWithoutDelivery ? this.appInfo.cart?.totalPriceWithoutDelivery : 0
        })
      }
    }

    let appInfo: IAppInfo = {
      ...this.appInfo,
      cart: {
        ...this.appInfo.cart,
        delivery_type: deliveryTypeFound
      }
    }

    this.storageService.setStorageKey(APP_INFO, JSON.stringify(appInfo));

  }

   /**
   * @description Disparado sempre que o bairro for acionado/trocado.
   * @author Felipe Baptistella.
   */
  public async neighborhoodChanged(e: any) {

    let neighborhoodFound = this.appInfo.neighborhoods
    .find((neighborhood: INeighborhood) => {
      return neighborhood.value === e.detail.value;
    })

    if (neighborhoodFound) {
      this.selectedNeighborhood = neighborhoodFound;
    }

    await this.appService.setCartTotalPriceWithDelivery({
      delivery: this.selectedDeliveryType,
      freight: this.selectedNeighborhood,
      totalPriceWithoutDelivery: this.appInfo.cart?.totalPriceWithoutDelivery ? this.appInfo.cart.totalPriceWithoutDelivery : 0
    })

  }

   /**
   * @description Definir método de pagamento.
   * @author Felipe Baptistella.
   */
   public async paymentMethodEnum(e: any) {

    let paymentMethodFound = this.MOCK_PAYMENT_METHODS
    .find((method: IPaymentMethod) => {
      return method.value === e.detail.value;
    })

    if (paymentMethodFound) {
      this.selectedPaymentMethod = paymentMethodFound;

      if (paymentMethodFound.value === PaymentMethodEnum.DINHEIRO) {
        this.changeForPayment = null;
      }
    }

    this.savePaymentMethodAndChange();
  }

  /**
   * @description Disparado que um produto for removido EM OUTRO COMPONENTE através de um Output.
   * @author Felipe Baptistella.
   */
  public async productHasRemoved(removed: boolean) {
    if (removed) {
      await this.appService.setTotalProductsToCart();

      if (this.appInfo.cart?.freight?.price) {
        await this.appService.setCartTotalPriceWithDelivery({
          delivery: this.selectedDeliveryType,
          freight: this.selectedNeighborhood,
          totalPriceWithoutDelivery: this.appInfo.cart?.totalPriceWithoutDelivery ? this.appInfo.cart.totalPriceWithoutDelivery : 0
        })
      } else {
        this.appService.setCartTotalPriceWithoutDelivery();
      }
    }
  }

  /**
   * @description Disparado que um produto tiver a quantidade alterada EM OUTRO COMPONENTE através de um Output.
   * @author Felipe Baptistella.
   */
  public async quantityHasChanged() {
    await this.appService.setTotalProductsToCart();

    if (this.appInfo.cart?.freight?.price) {
      await this.appService.setCartTotalPriceWithDelivery({
        delivery: this.selectedDeliveryType,
        freight: this.selectedNeighborhood,
        totalPriceWithoutDelivery: this.appInfo.cart?.totalPriceWithoutDelivery ? this.appInfo.cart.totalPriceWithoutDelivery : 0
      })
    } else {
      this.appService.setCartTotalPriceWithoutDelivery();
    }
  }

  /**
   * @description Preencher variáveis usadas na tela, essas em particular é relação aso selects de entrega e bairro.
   * @author Felipe Baptistella.
   */
  public fillVariables(appInfo: IAppInfo): void {
    if (appInfo.cart?.delivery_type?.value) {
      this.selectedDeliveryType = appInfo.cart.delivery_type;
      this.selectedDeliveryTypeUsedInSelect = appInfo.cart.delivery_type.value as DeliveryTypeEnum

      if (this.selectedDeliveryTypeUsedInSelect === DeliveryTypeEnum.DELIVERY && appInfo.cart?.freight?.value) {
        this.selectedNeighborhood = appInfo.cart.freight,
        this.selectedNeighborhoodUsedInSelect = appInfo.cart.freight.value
      }
    }

    if (appInfo.cart?.payment?.method?.value) {
      this.selectedPaymentMethod = appInfo.cart.payment.method;
      this.selectedPaymentMethodUsedInSelect = appInfo.cart.payment.method.value as PaymentMethodEnum;
    }

    if (appInfo.cart?.payment?.change) {
      this.changeForPayment = appInfo.cart?.payment?.change;
    }
  }

   /**
   * @description Definir ação do botão, ou irá enviar o pedido ou irá preencher os dados (se não tiver salvo).
   * @author Felipe Baptistella.
   */
  public async checkForClientAndSendOrder() {
    const alert = await this.alertCtrl.create({
      cssClass: 'advise-alert',
      backdropDismiss: false,
      subHeader: '',
      message: '',
      mode: 'ios',
      buttons: [
        {
          text: 'Preencher dados de entrega',
          role: 'destructive',
          handler: async () => {
            await alert.dismiss().then(() => {
              this.navCtrl.navigateForward(['app/profile'])
            })
          }
        }
      ]
    })

    if (!this.appInfo.cart?.client?.name) {
      alert.subHeader = 'Dados da entrega';
      alert.message = 'Você precisa definir os dados de entrega antes de enviar seu pedido';
      await alert.present()
    } else {
      this.sendOrder();
    }
  }

  /**
   * @description Monta a mensagem para ser enviada pelo whats.
   * @author Felipe Baptistella.
   */
  public prepareMessageForWhats(): string {
    let productsAsMessage;
    let deliveryTypeAsMessage;
    let deliveryInfoAsMessage;
    let total;

    deliveryInfoAsMessage = `*Dados da entrega*` + `\n` +
      `Endereço: ${this.appInfo.cart?.client?.address.street}, ${this.appInfo.cart?.client?.address.number} - ${this.appInfo.cart?.client?.address.neighborhood} - ${this.appInfo.cart?.client?.address.city} \n` +
      `Complemento: ${this.appInfo.cart?.client?.address.complement ? this.appInfo.cart?.client?.address.complement : '-'} \n` +
      `Ponto de referência: ${this.appInfo.cart?.client?.address.reference ? this.appInfo.cart?.client?.address.reference : '-'} \n`


    if (this.appInfo.cart?.products) {
     productsAsMessage = this.appInfo.cart?.products.map((productInsideCart: IProductFromOrder) => {
        return `Produto: ${productInsideCart.name}` + `\n` + `Quantidade: ${productInsideCart.quantity}` + `\n` + `Valor unitário: ${this.currencyPipe.transform(productInsideCart.price, 'BRL')?.toString()}` + `\n` + `Observações: ${productInsideCart.obs ? productInsideCart.obs : '-'}` + `\n` + `Total: ${this.currencyPipe.transform(productInsideCart.totalPrice, 'BRL')?.toString()}` + `\n` + `\n`
      })
    }

    if (this.appInfo.cart?.delivery_type && (this.appInfo.cart?.delivery_type?.value === DeliveryTypeEnum.PICK_UP)) {
      deliveryTypeAsMessage = `*Detalhes*` + `\n` + `Cliente irá retirar na loja` + `\n`;
      total = `*Total*: ${this.currencyPipe.transform(this.appInfo.cart.totalPriceWithoutDelivery, 'BRL')?.toString()}`
    }

    if (this.appInfo.cart?.delivery_type && (this.appInfo.cart?.delivery_type?.value === DeliveryTypeEnum.DELIVERY)) {
      deliveryTypeAsMessage = `*Detalhes*` + `\n` + `Cliente solicitou delivery` + `\n` + `Forma de pagamento: ${this.appInfo.cart?.payment?.method?.text}` + `\n` + `Precisa de troco: ${this.appInfo.cart?.payment?.change ? ('Sim, para ' + this.currencyPipe.transform(this.appInfo.cart?.payment?.change.toString().replace("R$", ""), 'BRL')?.toString()) : 'Não'}` + `\n` + `\n` + deliveryInfoAsMessage;
      total = `*Total*: ${this.currencyPipe.transform(this.appInfo.cart.totalPriceWithDelivery, 'BRL')?.toString()}`
    }

    const message =
      `*Pedido no Menu Online* \n` +
      `\n` +
      `*Lançamentos* \n` +
      `${productsAsMessage}` +
      `${deliveryTypeAsMessage}` +
      `\n` +
      `*Dados do Cliente* \n` +
      `Nome: ${this.appInfo.cart?.client?.name} \n` +
      `CPF: ${this.appInfo.cart?.client?.document} \n` +
      `Contato: ${this.appInfo.cart?.client?.phone} \n` +
      `\n` +
      `Subtotal: ${this.currencyPipe.transform(this.appInfo.cart?.totalPriceWithoutDelivery, 'BRL')?.toString()} \n` +
      `Taxa de entrega: ${this.appInfo.cart?.freight?.value ? this.currencyPipe.transform(this.appInfo.cart.freight.price, 'BRL')?.toString() : '-'} \n` +
      `${total}`

    return message
  }

  /**
   * @description Abre o whatsapp com a mensagem montada.
   * @author Felipe Baptistella.
   */
  public async sendOrder() {
    let phoneNumber: string = this.appInfo.phone;
    const mensagemCodificada = encodeURIComponent(this.prepareMessageForWhats());
    const urlWhatsApp = `https://wa.me/${phoneNumber}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
  }

  /**
   * @description Guarda o troco no ngrx sempre ao digitar.
   * @author Felipe Baptistella.
   */
  public savePaymentMethodAndChange(): void {
    this.store.dispatch(AppStore.setPaymentMethodAndChange({ paymentInfo: { method: this.selectedPaymentMethod, change: this.changeForPayment } }));

    let appInfo: IAppInfo = {
      ...this.appInfo,
      cart: {
        ...this.appInfo.cart,
        payment: {
          method: this.selectedPaymentMethod,
          change:  this.changeForPayment
        }
      }
    }

    this.storageService.setStorageKey(APP_INFO, JSON.stringify(appInfo));
  }
}
