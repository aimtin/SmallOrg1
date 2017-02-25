import { Component, Input, OnInit } from '@angular/core';
import { PhotoViewer } from 'ionic-native';

import { IProducts } from '../interfaces';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-product-avatar',
    template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}" (click)="zoom()" >`
})
export class ProductAvatarComponent implements OnInit {
    @Input() product: IProducts;
    imageLoaded: boolean = false;
    imageUrl: string;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        console.log('Product Avatar : ngOnInit ');
        let self = this;
        let firebaseConnected: boolean = self.dataService.isFirebaseConnected(); 
        if (self.product.key === 'default' || !firebaseConnected) {
            console.log('Product Avatar : !firebaseConnected ');
            self.imageUrl = 'assets/images/product.png';
            self.imageLoaded = true;
        } else {
            console.log('Product Avatar : firebaseConnected ');
            self.dataService.getProductsRef().child(self.product.key).once('value').then(function(snapshot) {
                var image = snapshot.val().image;
                if (image) {
                    self.dataService.getStorageRef().child('images/products/' + self.product.key + '/product.png').getDownloadURL().then(function (url) {
                        console.log('Product Avatar : firebaseConnected ' + url);
                        self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
                        self.imageLoaded = true;
                    });
                }else {
                    self.dataService.getStorageRef().child('images/products/default/product.png').getDownloadURL().then(function (url) {
                        console.log('Product Avatar : firebaseConnected ' + url);
                        self.imageUrl = url.split('?')[0] + '?alt=media' + '&t=' + (new Date().getTime());
                        self.imageLoaded = true;
                    });
                }
  
            });
            
        }
        
    }

    zoom() {
        PhotoViewer.show(this.imageUrl, this.product.productName, { share: false });
    }

    getProductImage() {
        var self = this;
        console.log('Product Avatar : getProductImage ');
        return self.dataService.getStorageRef().child('images/products/' + self.product.key + '/product.png').getDownloadURL();
    }
}