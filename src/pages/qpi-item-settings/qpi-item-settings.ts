import { Component } from '@angular/core';
import { ModalController, NavController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListBrandPage } from '../list-brand/list-brand';
import { ListQpiItemPage } from '../list-qpi-item/list-qpi-item';
import { BrandData } from '../../providers/brand-data';
/*
  Generated class for the QpiItemSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-qpi-item-settings',
  templateUrl: 'qpi-item-settings.html'
})
export class QpiItemSettingsPage {

  public qpiBrands = [];
  loading: Loading;
  constructor(public navCtrl: NavController, 
	public modalCtrl: ModalController, 

	public dataService: BrandData
	) {
 
	 this.dataService.getData().then((qpiBrands) => {
       if(qpiBrands){
        this.qpiBrands = JSON.parse(qpiBrands); 
      }
     });
 
  }
 
  ionViewDidLoad(){
 
  }
 
  addItem(){
     let addModal = this.modalCtrl.create(ListBrandPage);
     addModal.onDidDismiss((item) => {
           if(item){
			console.log("This is the data", item);
            this.saveItem(item);
          }
     });
    addModal.present();
  }
 
  saveItem(item){
	console.log("This is the data", item);  
    this.qpiBrands.push(item);
    this.dataService.save(this.qpiBrands);
  }
 
  viewItem(item){
    this.navCtrl.push(ListQpiItemPage, {
      item: item
    });
  }
  
  
    //launches the edit dialog
  edit(evt, index, item, slidingItem) {
    let ctrl = this;
    slidingItem.close();

  }
  
  //deletes the specified row
  delete(evt, index:number, item) {
    let ctrl = this;
    //this.showWaiting('Deleting expense...');
	//this.dataService.remove(item);

  }
}
