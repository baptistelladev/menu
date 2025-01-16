import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { AlertController, IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SearchModalContentComponent } from 'src/shared/components/search-modal-content/search-modal-content.component';
import { CategoryValueEnum } from 'src/shared/enums/EnumCategory';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { ICategory } from 'src/shared/interfaces/ICategory';
import { IProduct } from 'src/shared/interfaces/IProduct';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import * as AppStore from 'src/shared/store/app/app.state';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  @ViewChild('homeContent') homeContent : IonContent;

  public ICategoryValueEnum = CategoryValueEnum;

  public mostVisited: IProduct[];
  public classics: IProduct[];
  public specials: IProduct[];

  public selectedCategory: ICategory;

  public categories: ICategory[] = [
    {
      text: 'Início',
      value: CategoryValueEnum.INICIO
    },
    {
      text: 'Clássicos',
      value: CategoryValueEnum.CLASSICOS
    },
    {
      text: 'Especiais',
      value: CategoryValueEnum.ESPECIAIS
    }
  ]

  constructor(
    private modalCtrl : ModalController,
    private store : Store,
    private alertCtrl : AlertController
  ) { }

  ngOnInit() {
    this.getAppInfoFromNGRX();
    this.defineInitialCategory();
    this.checkForAppInfo(this.appInfo);
  }

  /**
   * @description Verificar se o possui dados preenchidos, se não o app avisa.
   * @author Felipe Baptistella.
   */
  public checkForAppInfo(appInfo: IAppInfo): void {
    if (!appInfo.cart?.client?.name) {
      this.showUserAdvise('Não se esqueça', 'Você precisará nos informar seu nome, endereço e telefone para realizar a entrega.');
    }
  }

  /**
   * @description Filtra os produtos do JSON e separa para mostrar em uma variável no front.
   * @author Felipe Baptistella.
   */
  public async setMostVisited(products: IProduct[]): Promise<IProduct[]> {
    this.mostVisited = products.filter((product: IProduct) => {
      return product.filters?.includes(CategoryValueEnum.MAIS_PEDIDOS)
    })

    return this.mostVisited
  }

  /**
   * @description Filtra os produtos do JSON e separa para mostrar em uma variável no front.
   * @author Felipe Baptistella.
   */
  public async setClassics(products: IProduct[]): Promise<IProduct[]> {
    this.classics = products.filter((product: IProduct) => {
      return product.filters?.includes(CategoryValueEnum.CLASSICOS)
    })

    return this.classics
  }

  /**
   * @description Filtra os produtos do JSON e separa para mostrar em uma variável no front.
   * @author Felipe Baptistella.
   */
  public async setSpecials(products: IProduct[]): Promise<IProduct[]> {
    this.specials = products.filter((product: IProduct) => {
      return product.filters?.includes(CategoryValueEnum.ESPECIAIS)
    })

    return this.specials
  }

  /**
   * @description Obtém as informações do NGRX e separada nas sessões.
   * @author Felipe Baptistella.
   */
  public getAppInfoFromNGRX(): void {
    this.appInfo$ = this.store.select(AppStore.selectAppInfo);
    this.appInfoSubscription = this.appInfo$.subscribe( async (appInfo: IAppInfo) => {
      this.appInfo = appInfo;

      if (this.appInfo.products) {
        await this.setMostVisited(this.appInfo.products);
        await this.setClassics(this.appInfo.products);
        await this.setSpecials(this.appInfo.products);
      }
    })
  }

  /**
   * @description Define uma categoria e desliza o conteúdo para a categoria.
   * @param category: obrigatório do tipo ICategory.
   * @author Felipe Baptistella.
   */
  public defineCategory(category: ICategory): void {
    this.selectedCategory = category;
    this.scrollContentToSection(this.selectedCategory.value)
  }

  /**
   * @description Define uma categoria ao iniciara tela.
   * @author Felipe Baptistella.
   */
  public defineInitialCategory(): void {
    this.selectedCategory = this.categories[0];
  }

  /**
   * @description Desliza o conteúdo para uma sessão específica.
   * @param sectionId: obrigatório do tipo ICategoryValue.
   * @author Felipe Baptistella.
   */
  public scrollContentToSection(sectionId: CategoryValueEnum): void {
    const section = document.getElementById(sectionId);

    if (section) {
      const yOffset = section.offsetTop;
      if (sectionId === CategoryValueEnum.INICIO) {
        this.homeContent.scrollToTop(1000);
      } else {
        this.homeContent.scrollToPoint(0, yOffset, 1000);
      }
    }
  }

  /**
   * @description Abrir modal de pesquisa.
   * @author Felipe Baptistella.
   */
  public async openSearchModal(): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      mode: 'ios',
      component: SearchModalContentComponent,
      initialBreakpoint: .80,
      breakpoints: [0, .80],
      componentProps: {
        appInfo: this.appInfo
      }
    })

    await modal.present();

    return modal;
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

  /**
   * @description Mostra ao usuário um alerta
   * @returns Promessa de um alerta (componente do Ionic).
   * @author Felipe Baptistella
   */
  public async showUserAdvise(subHeader: string, message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      subHeader: subHeader,
      message: message,
      buttons: ['Entendi'],
      cssClass: 'advise-alert'
    })

    await alert.present();

    return alert;
  }

}
