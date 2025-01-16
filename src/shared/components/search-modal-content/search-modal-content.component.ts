import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppInfo } from '@capacitor/app';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IProduct } from 'src/shared/interfaces/IProduct';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';

@Component({
  standalone: false,
  selector: 'app-search-modal-content',
  templateUrl: './search-modal-content.component.html',
  styleUrls: ['./search-modal-content.component.scss'],
})
export class SearchModalContentComponent  implements OnInit, OnDestroy {

  public searchTerm: string = '';

  @Input() appInfo: IAppInfo;

  public filteredProducts: IProduct[]

  constructor() { }

  ngOnInit() {

  }

  public setFilteredProducts(): void {
    this.filteredProducts  = [...this.appInfo.products];
  }

  // Filtra os produtos com base no termo de busca
  public filterProducts() {
    const searchTermLower = this.searchTerm.toLowerCase(); // Ignorar maiúsculas/minúsculas

  if (searchTermLower.length === 0) {
    // Se o campo estiver vazio, mostre todos os produtos
    this.filteredProducts = [];
    return;
  }

  // Filtra produtos com base no termo de busca
  this.filteredProducts = this.appInfo.products.filter((product) =>
    product.name.toLowerCase().includes(searchTermLower)
  );
  }

  /**
   * @description Checa se o produto passado como parâmetro existe no array de produtos do carrinho.
   * @param product obrigatório do tipo IProduct que representa o produto dentro do ngFor.
   * @returns boolean para bloquear ou desbloquear o card do produto
   * @author Felipe Baptistella.
   */
  public hasProductInTheCart(product: IProduct): boolean {
    let hasProduct = this.appInfo.cart?.products?.find((productInTheCart: IProductFromOrder) => {
      return productInTheCart.id === product.id;
    })

    if (hasProduct) {
      return true
    } else {
      return false
    }
  }

  ngOnDestroy(): void {
    this.searchTerm = '';
  }

}
