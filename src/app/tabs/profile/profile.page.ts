import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { StorageService } from 'src/core/services/storage.service';
import { APP_INFO } from 'src/shared/consts/key';
import { CPF_MASK, PHONE_MASK } from 'src/shared/consts/masks';
import { IAppInfo } from 'src/shared/interfaces/IAppInfo';
import { IClient } from 'src/shared/interfaces/IClient';
import * as AppStore from 'src/shared/store/app/app.state';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public isDefiningInfo: boolean = false;

  public showProfileForm: boolean = false;

  public profileForm: FormGroup;

  readonly CPF_MASK: MaskitoOptions = CPF_MASK;
  readonly PHONE_MASK: MaskitoOptions = PHONE_MASK;

  // ISSO É O QUE PERMITE O MASKITO APLICAR A MÁSCARA NO FORMULÁRIO DO HTML E NÃO ION-INPUT.
  readonly maskPredicate: MaskitoElementPredicate = async (el: any) => (el as HTMLIonInputElement).getInputElement();

  public appInfo: IAppInfo;
  public appInfo$: Observable<IAppInfo>;
  public appInfoSubscription: Subscription;

  public formHasChangesBlockButton: boolean = true;
  public formHasChangesBlockButton$: Observable<boolean>;
  public formHasChangesBlockButtonSubscription: Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private title : Title,
    private store : Store,
    private storageService : StorageService,
    private navCtrl : NavController,
    private alertCtrl : AlertController
  ) { }

  ngOnInit() {
    this.initProfileForm();
    this.getAppInfoFromNGRX();
    this.title.setTitle('Seus dados | Chiara - Linguiça Artesanal');
    this.listenToFormChanges();
  }

  /**
     * @description Obtém as informações do NGRX e separada nas sessões.
     * @author Felipe Baptistella.
     */
    public getAppInfoFromNGRX(): void {
      this.appInfo$ = this.store.select(AppStore.selectAppInfo);
      this.appInfoSubscription = this.appInfo$.subscribe( async (appInfo: IAppInfo) => {
        this.appInfo = appInfo;
        this.fillForm(this.appInfo.cart?.client)
      })
    }

  /**
   * @description Inicia o formulário relativo ao perfil da pessoa, necessário para realizar a entrega.
   * @author Felipe Baptistella.
   */
  public initProfileForm(): void {
    this.profileForm = this.formBuilder
    .group({
      name: [ null, [ Validators.required ] ],
      document: [ null, [ Validators.required, Validators.minLength(14) ] ],
      phone: [ null, [ Validators.required, Validators.minLength(14) ] ],
      street: [ null, [ Validators.required ] ],
      number: [ null, [ Validators.required ] ],
      neighborhood: [ null, [ Validators.required ] ],
      city: [ null, [ Validators.required ] ],
      complement: [ null ],
      reference: [ null ]
    })
  }

  /**
   * @description Define o perfil da pessoa que irá receber a entrega.
   * @observation Precisamos nos certificar que isso será refletido no app inteiro e na storage para caso atualize a tela ja seja preenchido automaticamente.
   * @param client obrigatório do tipo cliente
   */
  public defineProfile(isUpdate?: boolean): void {

    this.isDefiningInfo = true;

    const client = {
      name: this.profileForm.value.name,
      document: this.profileForm.value.document,
      phone: this.profileForm.value.phone,
      address: {
        street : this.profileForm.value.street,
        number : this.profileForm.value.number,
        neighborhood : this.profileForm.value.neighborhood,
        complement : this.profileForm.value.complement,
        city : this.profileForm.value.city,
        reference : this.profileForm.value.reference
      }
    }

    let appInfo: IAppInfo = {
      ...this.appInfo,
      cart: {
        ...this.appInfo.cart,
        client: client
      }
    }

    this.store.dispatch(AppStore.setClient({ client: client }))
    this.storageService.setStorageKey(APP_INFO, JSON.stringify(appInfo));

    this.showAlertClientDefined();
  }

  /**
   * @description Preenche o formulário com um cliente passado como parâmetro.
   * @param client obrigatório do tipo cliente
   */
  public fillForm(client?: IClient): void {
    this.profileForm.patchValue({
      name: client?.name,
      document: client?.document,
      phone: client?.phone,
      street: client?.address.street,
      number: client?.address.number,
      neighborhood: client?.address.neighborhood,
      city: client?.address.city,
      complement: client?.address.complement,
      reference: client?.address.reference
    })
  }

  /**
   * @description Escuta por mudanças no form e atribui uma varíavel, será usada para desbloquear o botão de atualizar dados.
   */
  public listenToFormChanges(): void {
    this.formHasChangesBlockButton$ = this.profileForm.valueChanges;
    this.formHasChangesBlockButtonSubscription = this.formHasChangesBlockButton$.subscribe((res) => {
      if (res) {
        this.formHasChangesBlockButton = false;
      } else {
        this.formHasChangesBlockButton = true;
      }
    })
  }

  /**
   * @description Mostra um alerta para avisando que o usuário definiu as informações.
   */
  public async showAlertClientDefined(): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      cssClass: 'advise-alert',
      backdropDismiss: false,
      subHeader: `Boa ${this.appInfo.cart?.client?.name}`,
      message: 'Vá para o carrinho e adicione ou finalize seu pedido.',
      mode: 'ios',
      buttons: [
        {
          text: 'Ir para o carrinho',
          role: 'destructive',
          handler: async () => {
            await alert.dismiss()
          }
        }
      ]
    })

    await alert.present();

    await alert.onDidDismiss().then(() => {
      this.isDefiningInfo = false;
      this.navCtrl.navigateBack(['app/cart']);
    })

    return alert
  }

}
