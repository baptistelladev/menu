import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/core/services/storage.service';
import { ALREADY_SEE_SPLASH_SCREEN } from 'src/shared/consts/key';

@Component({
  standalone: false,
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {

  constructor(
    private navCtrl : NavController,
    private storage : StorageService
  ) { }

  async ngOnInit() {
    this.goToTabsPage();
  }

  /**
   * @description Direcionar usuário para a tela principal após 3 segundos.
   * @author Felipe Baptistella
   */
  public goToTabsPage() {
    setTimeout(async () => {
      await this.storage.setStorageKey(ALREADY_SEE_SPLASH_SCREEN, true)
      .then(() => {
        this.navCtrl.navigateForward(['app']);
      })
    }, 3000);
  }
}
