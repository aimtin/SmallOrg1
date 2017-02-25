import { Component, EventEmitter, OnInit, OnDestroy, Input, Output} from '@angular/core';
import { Events} from 'ionic-angular';

import { IProducts } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-list',
    templateUrl: 'product.list.html'
})
export class ProductList implements OnInit, OnDestroy {
    @Input() product: IProducts;
    @Output() onAddProducts = new EventEmitter<any>();
    

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

    addToCart(product: any) {
        console.log('addToCart : ' + product.key);
 
        this.onAddProducts.emit(product);
        
    }

}