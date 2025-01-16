import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import * as AppStore from 'src/shared/store/app/app.state';

// TYPES
interface ITabsButton {
  text: string,
  icon: string,
  route: string,
  value: TabsValueEnum
}

// ENUM
enum TabsValueEnum {
  HOME = 'HOME',
  CART = 'CART',
  PROFILE = 'PROFILE'
}

@Component({
  standalone: false,
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {



  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  public currentYear: number = moment().year();

  public selectedButton: ITabsButton;
  public activeRoute: TabsValueEnum;

  public tabsButtons: ITabsButton[] = [
    {
      text: 'Início',
      icon: 'home',
      route: 'home',
      value: TabsValueEnum.HOME
    },
    {
      text: 'Carrinho',
      icon: 'cart',
      route: 'cart',
      value: TabsValueEnum.CART
    },
    {
      text: 'Perfil',
      icon: 'person-add',
      route: 'profile',
      value: TabsValueEnum.PROFILE
    }
  ]

  constructor(
    private router : Router,
    private store : Store
  ) { }

  async ngOnInit() {
    this.listenForUrlChanges();
    this.getAppInfo();
  }

  public getAppInfo(): void {
    this.appInfo$ = this.store.select(AppStore.selectAppInfo);
    this.appInfoSubscription = this.appInfo$.subscribe( async (appInfo: IAppInfo) => {
      this.appInfo = appInfo;
    })
  }

  /**
   * @description Seleciona uma tab com base de um valor do TabsValueEnum.
   * @param buttonValue obrigatório do tipo TabsValueEnum.
   * @author Felipe Baptistella
   */
  public async selectTabButton(buttonValue: TabsValueEnum) {
    let foundbutton: ITabsButton | undefined = this.tabsButtons
    .find((button: ITabsButton) => {
      return button.value === buttonValue;
    })

    if (foundbutton) { this.selectedButton = foundbutton; }
  }

  /**
   * @description Obtém a url, transforma a string e devolve para ser usado.
   * @observation Poderia fazer tudo em uma linha só mas assim fica mais legível.
   * @returns path da url atual em letra maíuscula para dar match com o TabsValueEnum.
   * @author Felipe Baptistella
   */
  public async listenLastPathFromUrl() {
    let url = this.router.url;
    let urlLastPath = url.split('/')[2];
    let urlUppercase = urlLastPath.toUpperCase();
    this.activeRoute = urlUppercase as TabsValueEnum;
    return this.activeRoute;
  }

  /**
   * @description Escuta por mudanças na url para que a tabs faça o efeito de preencher o ícone na tela ativa.
   * @observation Não podemos nos DESINSCREVER desse Observable por que ele precisa estar sempre escutando.
   * @author Felipe Baptistella
   */
  public listenForUrlChanges(): void {
    this.router.events.subscribe( async (event) => {
      if (event instanceof NavigationEnd) {
        await this.listenLastPathFromUrl();
        await this.selectTabButton(this.activeRoute);
      }
    });
  }
}
