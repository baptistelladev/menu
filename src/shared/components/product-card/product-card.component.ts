import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ModalOptions, NavController } from '@ionic/angular';
import { ProductCardModalContentComponent } from '../product-card-modal-content/product-card-modal-content.component';
import { IProduct } from 'src/shared/interfaces/IProduct';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';

@Component({
  standalone: false,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent  implements OnInit {

  @Input() isDisabled: boolean | undefined = false;
  @Input() direction: 'vertical' | 'horizontal';
  @Input() product: IProduct;

  constructor(
    private modalCtrl : ModalController,
    private alertCtrl : AlertController
  ) { }

  ngOnInit() {

  }

  /**
   * @description Define o que usuário irá ver: o modal com informações do produto ou alerta.
   * Se o card não estiver bloqueado: Abre o modal.
   * Se o card estiver bloqueado: Mostra um alerta.
   * @author Felipe Baptistella.
   */
  public async openProductDetails() {
    const modal = await this.modalCtrl.create({
      component: ProductCardModalContentComponent,
      mode: 'md',
      cssClass: 'menu-full-modal',
      componentProps: {
        product: this.product
      },
      id: `detail-from-${this.product.id}`
    })

    if (this.isDisabled) {
      await this.showAdvise()
    } else {
      await modal.present();
    }
  }

  public async showAdvise(): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Já adicionado',
      message: `${this.product.name} já está no seu carrinho, confira.`,
      mode: 'ios',
      cssClass: 'advise-alert',
      buttons: ['Entendi'],
      id: `advise-from-${this.product.id}`
    })

    await alert.present();
    return alert;
  }
}
