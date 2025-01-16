import { AppService } from './../assets/services/app.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { StorageService } from 'src/core/services/storage.service';
import { ALREADY_SEE_SPLASH_SCREEN, APP_INFO } from 'src/shared/consts/key';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import * as AppStore from 'src/shared/store/app/app.state'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {

  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  constructor(
    private storage : StorageService,
    private navCtrl : NavController,
    public router : Router,
    private appService : AppService,
    private store : Store
  ) {}

  public async ngOnInit() {
    await this.storage.createStorage().then(() => {
      this.getPlaceInfoFromService();
    })
  }

  public async ngAfterViewInit() {
    let alreadyVisited: boolean = await this.checkIfAlreadyVisited();
    await this.defineWhatUserWillSee(alreadyVisited);
  }

  /**
   * @description Simula o app indo buscar as informações em um serviço externo.
   * @author Felipe Baptistella
   */
  public async getPlaceInfoFromService() {

    await this.storage.getStorageKey(APP_INFO).then((res: any) => {
      let appInfoFromStorage: IAppInfo = JSON.parse(res);

      this.appInfo$ = this.appService.getAppInfo();
      this.appInfo$.subscribe(async (appInfo: IAppInfo) => {
        this.appInfo = appInfo;

        if (res) {
          this.appInfo = {
            ...this.appInfo,
            cart: appInfoFromStorage.cart
          }
        }

        this.store.dispatch(AppStore.setAppAllInfo({ appInfo: this.appInfo }));
      })
    })
  }

  /**
   * @description Obtém booleano da storage.
   * @param alreadyVisited obrigatório do tipo booleano.
   * @returns Promessa de um booleano.
   * @author Felipe Baptistella
   */
  public async checkIfAlreadyVisited(): Promise<boolean> {
    return await this.storage.getStorageKey(ALREADY_SEE_SPLASH_SCREEN);
  }

  /**
   * @description Define o que o usuário irá visualizar: tela principal do app ou splashscreen.
   * @param alreadyVisited obrigatório do tipo booleano.
   * @author Felipe Baptistella
   */
  public async defineWhatUserWillSee(alreadyVisited: boolean) {
    alreadyVisited ? this.navCtrl.navigateForward(['app']) : this.navCtrl.navigateForward(['splash-screen']);
  }
}
