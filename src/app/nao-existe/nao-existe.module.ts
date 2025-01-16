import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NaoExistePageRoutingModule } from './nao-existe-routing.module';

import { NaoExistePage } from './nao-existe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NaoExistePageRoutingModule
  ],
  declarations: [NaoExistePage]
})
export class NaoExistePageModule {}
