import { Component } from '@angular/core';
import { ModalController, NavController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListBrandPage } from '../list-brand/list-brand';
import { ListQpiItemPage } from '../list-qpi-item/list-qpi-item';
import { QuoData } from '../../providers/quo-data';

/*
  Generated class for the QuotationCart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-quotation-cart',
  templateUrl: 'quotation-cart.html'
})
export class QuotationCartPage {
  public quoItems = [];
  constructor(public navCtrl: NavController, 
	public modalCtrl: ModalController, 
	public dataService: QuoData
	) {

	 this.dataService.getData().then((quoItems) => {
       if(quoItems){
        this.quoItems = JSON.parse(quoItems); 
      }
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationCartPage');
  }

}
