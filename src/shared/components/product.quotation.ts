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
    

    constructor(private dataService: DataService,
                public events: Events) { }

    ngOnInit() {
        //var self = this;
        //self.dataService.getProductsRef().child(self.product.key).on('child_changed', self.onCommentAdded);
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


}