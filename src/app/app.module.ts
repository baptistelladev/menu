import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

// SWIPER
import {register} from 'swiper/element/bundle';
import { provideHttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from 'src/shared/store/app/app.state';
import { StorageService } from 'src/core/services/storage.service';
import { AppService } from 'src/assets/services/app.service';
register();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot({
    name: 'chiara-storage',
    storeName: 'chiara-store',
    dbKey: 'chiara-key'
  }), StoreModule.forRoot({ app: appReducer}, {}), StoreDevtoolsModule.instrument({
    maxAge: 25, // Retém os últimos 25 estados
    connectInZone: true, // Conecta dentro da zona Angular
  }),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(), StorageService, AppService ],
  bootstrap: [AppComponent],
})
export class AppModule {}
