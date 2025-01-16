import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as AppStore from 'src/shared/store/app/app.state'

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent  implements OnInit {
  @Input() handler: 'modal' | 'page';

  public totalProducts: number | undefined;
  public totalProducts$: Observable<number | undefined>;
  public totalProductsSubscription: Subscription;

  constructor(
    private navCtrl : NavController,
    private modalCtrl : ModalController,
    private store : Store
  ) { }

  ngOnInit() {
    this.getCartTotalProductsFromNGRX();
  }

  /**
   * @description Vai para a tela de carrinho.
   * @author Felipe Baptistella.
   */
  public goToCartPage(): void {
    this.navCtrl.navigateForward(['app/cart']);
  }

  /**
   * @description Fecha o modal e vai para a tela de carrinho.
   * @author Felipe Baptistella.
   */
  public async closeCurrentModalAndGoToPage() {
    await this.modalCtrl.dismiss().then(() => {
      this.goToCartPage();
    })
  }

  /**
   * @description Comportamento do botão
   * SE for dentro de um modal: fecha e vai para o carrinho.
   * SE for dentro de uma tela: só segue para o carrinho.
   * @author Felipe Baptistella.
   */
  public async buttonHandler() {
    this.handler === 'modal' ? this.closeCurrentModalAndGoToPage() : this.goToCartPage();
  }

  /**
   * @description Obtém o total de produtos guardados no NGRX.
   * @author Felipe Baptistella.
   */
  public getCartTotalProductsFromNGRX(): void {
    this.totalProducts$ = this.store.select(AppStore.selectCartTotalProducts);
    this.totalProductsSubscription = this.totalProducts$.subscribe((totalProducts: number | undefined) => {
      this.totalProducts = totalProducts;
    })
  }
}
