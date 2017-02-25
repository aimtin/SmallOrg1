import { Component, EventEmitter, OnInit, OnDestroy, Input, Output} from '@angular/core';
import { Events} from 'ionic-angular';

import { IProducts } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-product',
    templateUrl: 'product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {
    @Input() product: IProducts;
    @Output() onModifyProducts = new EventEmitter<string>();
    //@Output() onDeleteProducts = new EventEmitter<string>();

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

    modifyProduct(key: string) {
        console.log('modifyProduct : ' + key);
 
        this.onModifyProducts.emit(key);
        
    }

    deleteProduct(key: string) {
      var self = this;

        console.log('deleteProduct : ' + key);

        self.dataService.deleteProduct(key).then(function (snapshot) {
            self.events.publish('product:deleted');      
        });

    }

    logoProduct(key: string){
        this.events.publish('image:created', key);
    }

}