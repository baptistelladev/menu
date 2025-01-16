import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NaoExistePage } from './nao-existe.page';

const routes: Routes = [
  {
    path: '',
    component: NaoExistePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NaoExistePageRoutingModule {}
