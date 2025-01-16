import { selectCartTotalProducts } from './../../store/app/app.state';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppService } from 'src/assets/services/app.service';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IProduct } from 'src/shared/interfaces/IProduct';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import * as AppStore from 'src/shared/store/app/app.state';

@Component({
  standalone: false,
  selector: 'app-product-card-modal-content',
  templateUrl: './product-card-modal-content.component.html',
  styleUrls: ['./product-card-modal-content.component.scss'],
})
export class ProductCardModalContentComponent  implements OnInit {

  public productForm: FormGroup;

  @Input() product : IProduct;

  public totalPrice: number;

  constructor(
    private modalCtrl : ModalController,
    private formBuilder : FormBuilder,
    private store : Store,
    private appService : AppService,
    private loadingCtrl : LoadingController
  ) { }

  ngOnInit() {
    this.initProductForm();
    this.setTotalFromButton();
  }

  /**
   * @description Fecha os modais (no caso só o que está aberto, que é o produto).
   * @author Felipe Baptistella.
   */
  public async closeModal() {
    await this.modalCtrl.dismiss();
  }

  /**
   * @description Inicia o formulário de produto com o preço e a observação inserida pelo usuário.
   * @author Felipe Baptistella.
   */
  public initProductForm() {
    this.productForm = this.formBuilder.group({
      quantity: 1,
      obs: [null]
    })
  }

  /**
   * @description Pega a quantidade e soma 1 e faz o calculo.
   * @author Felipe Baptistella.
   */
  public increase(): void {
    const currentValue = this.productForm.get(`quantity`)?.value || 0;
    this.productForm.patchValue({
      quantity: currentValue + 1
    });

    this.setTotalFromButton();
  }

  /**
   * @description Pega a quantidade e subtrai 1 e faz o calculo.
   * @author Felipe Baptistella.
   */
  public decrease(): void {
    const currentValue = this.productForm.get(`quantity`)?.value || 0;
    if (currentValue > 0) {
      this.productForm.patchValue({
        quantity: currentValue - 1
      });
    }

    this.setTotalFromButton();
  }

  /**
   * @description Seta o total que será adicionado no carrinho. Basicamente multiplica o número de itens * valor do produto.
   * @author Felipe Baptistella.
   */
  public setTotalFromButton(): void {
    let quantity = Number(this.productForm.get(`quantity`)?.value)
    let price = Number(this.product.price);
    this.totalPrice = quantity * price;
  }

  public async addToCart() {
    const loading = await this.fireLoading();

    loading.present();

    let productToAdd: IProductFromOrder = {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      obs: this.productForm.value.obs,
      quantity: this.productForm.value.quantity,
      price: this.product.price,
      totalPrice: this.totalPrice
    }

    loading.onDidDismiss().then(async () => {
      await this.appService.addProductToCart(productToAdd);
      await this.modalCtrl.dismiss();
      await this.appService.setTotalProductsToCart();
    })
  }

  /**
   * @description Dispara o loading.
   * @author Felipe Baptistella.
   */
  public async fireLoading(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      duration: 300,
      cssClass: 'menu-loading',
      spinner: 'lines-sharp'
    })

    return loading
  }

}
