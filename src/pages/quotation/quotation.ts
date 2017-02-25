import { Component, OnInit, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events, LoadingController, ActionSheetController} from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';

import { CartPage } from '../cart/cart';
import { IProducts } from '../../shared/interfaces';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage implements OnInit, OnDestroy{
  @ViewChild(Content) content: Content;
  queryText: string = '';
  public start: number;
  public loading: boolean = true;
  public internetConnected: boolean = true;
  public refreshFlag: boolean = true;
  public products: Array<IProducts> = [];
  public cart: Array<IProducts> = [];
  
  public firebaseConnectionAttempts: number = 0;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public dataService: DataService,
    public sqliteService: SqliteService,
    public mappingsService: MappingsService,
    public itemsService: ItemsService,
    public actionSheeCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public events: Events) { }

  	ngOnInit() {
    	console.log('Quotation Page : ngOnInit ');
    	this.loadQuoPage();
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad Page');
  	}

  	public ngOnDestroy(){
    	console.log('list destroyed');
	}

  	ionViewWillEnter() {
    	console.log('ionViewWillEnter page.');
    	if (this.refreshFlag === false){
      		this.refreshFlag = true;
      		this.loadProducts();
    	}
 	}

  	ionViewWillLeave() {
    	console.log('ionViewWillLeave page.');
    	this.refreshFlag = false;
  	}

  	loadQuoPage()
  	{
    	var self = this;
    	self.events.subscribe('network:connected', self.networkConnected);
    	console.log('Quotation Page : loadQuoPage ');
    	self.checkFirebase();
  	}

  	checkFirebase() {
    	console.log('Quotation Page : checkFirebase ');
    	let self = this;
    	if (!self.dataService.isFirebaseConnected()) {
      		setTimeout(function () {
        		console.log('Retry : ' + self.firebaseConnectionAttempts);
        		self.firebaseConnectionAttempts++;
        		if (self.firebaseConnectionAttempts < 5) {
          			self.checkFirebase();
        		} else {
          			self.internetConnected = false;
          			self.dataService.goOffline();
          			// self.loadSqliteProducts();
        		}
      		}, 1000);
    	} else {
      		console.log('Firebase connection found (products.ts) - attempt: ' + self.firebaseConnectionAttempts);
      		if (self.authService.getLoggedInUser() === null) {
            } else {
        		self.loadProducts();
      		}
    	}
  	}

   	public networkConnected = (connection) => {
    	console.log('Quo Page : networkConnected ');
    	var self = this;
    	self.internetConnected = connection[0];
    	console.log('NetworkConnected event: ' + self.internetConnected);

    	if (self.internetConnected) {
      		self.products = [];
      		self.loadProducts();
    	} else {
      		self.notify('Connection lost. Working offline..');
      		// save current products..
      		setTimeout(function () {
        		console.log(self.products.length);
        		// self.sqliteService.saveProducts(self.products);
        		 // self.loadSqliteProducts();
      		}, 1000);
    	}
  	}

  	loadProducts() {
    	console.log('Quo Page : loadProducts ');
    	var self = this;
    	self.loading = true;
      	self.products = [];
      	self.cart = [];
      	self.getProducts();
  	}

  	getProducts() {
    	console.log('Quo Page : getProducts ');
    	var self = this;
    	self.products = [];
    	self.dataService.getUserProducts(self.authService.getLoggedInUser().uid)
    	.then(function (snapshot) {
        	self.itemsService.reversedItems<IProducts>(self.mappingsService.getProducts(snapshot)).forEach(function (product) {
          		self.products.push(product);
        	});
        	self.events.publish('Products:viewed');
        	self.loading = false;
      	});
  	}

  	notify(message: string) {
    	console.log('Quo Page : notify ');
    	let toast = this.toastCtrl.create({
      		message: message,
      		duration: 3000,
      		position: 'top'
    	});
    	toast.present();
  	}

	viewCart() 
  	{
      	console.log('View Cart: ');
      	let self = this;
      	if (self.internetConnected) {
        	self.navCtrl.push(CartPage, {
          		productList: self.cart
        	});
      	} else {
        	self.notify('Network not found..');
      	}
    }

    addProduct(product: any) 
  	{
      	console.log('add to cart product: ' + product.key);
      	if (this.internetConnected) 
      	{
     		this.cart.push(product);   	
        } 
        else {
        	this.notify('Network not found..');
      	}
    }
}
