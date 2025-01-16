import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppService } from 'src/assets/services/app.service';
import { IProductFromOrder } from 'src/shared/interfaces/IProductFromOrder';
import * as AppStore from 'src/shared/store/app/app.state';

@Component({
  standalone: false,
  selector: 'app-product-card-inside-cart',
  templateUrl: './product-card-inside-cart.component.html',
  styleUrls: ['./product-card-inside-cart.component.scss'],
})
export class ProductCardInsideCartComponent  implements OnInit {

  @Output() quantityHasChanged: EventEmitter<any> = new EventEmitter();
  @Output() produtHasRemoved: EventEmitter<any> = new EventEmitter();
  @Input() product: IProductFromOrder

  public productFormGroup: FormGroup;

  constructor(
    public appService : AppService,
    private formBuilder: FormBuilder,
    private store : Store
  ) { }

  ngOnInit() {
    this.initProductForm();
  }

  public async removeProductFromCart(product: IProductFromOrder) {
    await this.appService.removeAppFromCart(product);
    this.sendNotification();
  }

  public sendNotification() {
    this.produtHasRemoved.emit(true);
  }

  public initProductForm() {
    this.productFormGroup = this.formBuilder.group({
      [`quantity_${this.product.id}`]: 0
    })

    this.productFormGroup.patchValue({ [`quantity_${this.product.id}`]: this.product.quantity });
  }

  public increaseProduct(): void {
    this.store.dispatch(AppStore.increaseProduct({ product: this.product} ));
    this.quantityHasChanged.emit();
  }

  public decreaseProduct(): void {
    this.store.dispatch(AppStore.decreaseProduct({ product: this.product} ));
    this.quantityHasChanged.emit();
  }

}
