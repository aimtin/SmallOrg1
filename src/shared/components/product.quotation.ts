import { Component, EventEmitter, OnInit, OnDestroy, Input, Output} from '@angular/core';
import { Events} from 'ionic-angular';

import { IProducts } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-quotation',
    templateUrl: 'product.quotation.html'
})
export class ProductQuotation implements OnInit, OnDestroy {
    @Input() product: IProducts;
    @Output() onDeleteProducts = new EventEmitter<any>();
    public products: Array<IProducts> = [];
    public quantity: number = 1;

    

    constructor(private dataService: DataService,
                public events: Events) { }

    ngOnInit() {
        //var self = this;
        //self.dataService.getProductsRef().child(self.product.key).on('child_changed', self.onCommentAdded);
        this.product.qty = this.quantity;
    }

    ngOnDestroy() {
         console.log('destroying..');
        //var self = this;
        //self.dataService.getProductsRef().child(self.product.key).off('child_changed', self.onCommentAdded);
    }

    deleteFromCart(product: any) {
        console.log('deleteFromCart : ' + product.key);
 
        this.onDeleteProducts.emit(product);
        
    }

     


    quantityPlus(product){
       this.quantity = this.product.qty;  
           
        this.quantity += 1;
        this.product.qty = this.quantity;
    }

    quantityMinus(product){
    
      this.quantity = this.product.qty;  
      this.quantity -= 1;
      this.product.qty = this.quantity;
    }



  //  getGrandTotal(): number{
    //    var amount = 0;
      //  for(var i = 0; i < this.products.length; i++){
           // amount += (this.products[i].rate * this.products[i].qty);
       // }
       // return amount;
   // }



}