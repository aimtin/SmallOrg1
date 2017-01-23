import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { ListBrandPage } from '../list-brand/list-brand';
import { ListItemPage } from '../list-item/list-item';
import { ListItemDetailPage } from '../list-item-detail/list-item-detail';
import { QpiData } from '../../providers/qpi-data';
/*
  Generated class for the ListQpiItem page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-qpi-item',
  templateUrl: 'list-qpi-item.html'
})
export class ListQpiItemPage {

  public qpiItems = [];
  public brand;
  public products = [];
  loading: Loading;
  constructor(public navCtrl: NavController, 
	public modalCtrl: ModalController, 
	public navParams: NavParams,
	public dataService: QpiData
	) {
 
    this.dataService.getData().then((qpiItems) => {
       if(qpiItems){
        this.qpiItems = JSON.parse(qpiItems); 
      }
     });
  }
 
  ionViewDidLoad(){
	console.log(this.navParams);
		this.brand = this.navParams.get('item').brand;
  }
 
  addItem(){
     let addModal = this.modalCtrl.create(ListItemPage);
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
    this.qpiItems.push(item);
    this.dataService.save(this.qpiItems);
  }
 
  viewItem(item){
    this.navCtrl.push(ListItemDetailPage, {
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
  initializeProducts(){
	  this.qpiItems.forEach((item) => {
		  this.products.push(item.product);
	  });
  }
  getProducts(ev) {
    // Reset items back to all of the items
    this.initializeProducts();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.products = this.products.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
