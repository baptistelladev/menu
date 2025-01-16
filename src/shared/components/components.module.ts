import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { IonicModule } from '@ionic/angular';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductCardModalContentComponent } from './product-card-modal-content/product-card-modal-content.component';
import { SearchModalContentComponent } from './search-modal-content/search-modal-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAdviseComponent } from './user-advise/user-advise.component';
import { ProductCardInsideCartComponent } from './product-card-inside-cart/product-card-inside-cart.component';

@NgModule({
  declarations: [
    CartComponent,
    ProductCardComponent,
    ProductCardModalContentComponent,
    SearchModalContentComponent,
    UserAdviseComponent,
    ProductCardInsideCartComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CartComponent,
    ProductCardComponent,
    ProductCardModalContentComponent,
    SearchModalContentComponent,
    UserAdviseComponent,
    ProductCardInsideCartComponent
  ]
})
export class ComponentsModule { }
