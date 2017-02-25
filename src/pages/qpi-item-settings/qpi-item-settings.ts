import { Component, OnInit, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events, LoadingController, ActionSheetController} from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';

import { IProducts } from '../../shared/interfaces';
import { ProductCreatePage } from '../product-create/product-create';
import { ProductModifyPage } from '../product-modify/product-modify';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';

@Component({
  selector: 'page-qpi-item-settings',
  templateUrl: 'qpi-item-settings.html'
})
export class QpiItemSettingsPage implements OnInit, OnDestroy{
  @ViewChild(Content) content: Content;
  queryText: string = '';
  public start: number;
  public loading: boolean = true;
  public internetConnected: boolean = true;
  public refreshFlag: boolean = true;
  public products: Array<IProducts> = [];
  public newProducts: Array<IProducts> = [];
  
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
    	console.log('Qpi-Settings Page : ngOnInit ');
    	this.loadQpiPage();
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

  	loadQpiPage()
  	{
    	var self = this;
    	self.events.subscribe('network:connected', self.networkConnected);
    	self.events.subscribe('product:created', self.productsReload);
    	self.events.subscribe('product:deleted', self.productsReload);
    	self.events.subscribe('productImage:created', self.productImageUpload);
    	console.log('Qpi Page : loadQpiPage ');
    	self.checkFirebase();
  	}

  	checkFirebase() {
    	console.log('Qpi Page : checkFirebase ');
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
      		//self.dataService.getProductsRef().orderByChild('user/uid').equalTo(self.authService.getLoggedInUser().uid).on('child_removed', self.onChangeReload);
      		//self.dataService.getProductsRef().orderByChild('user/uid').equalTo(self.authService.getLoggedInUser().uid).on('child_added', self.onOrgAdded);
      		if (self.authService.getLoggedInUser() === null) {
            } else {
        		self.loadProducts();
      		}
    	}
  	}

  /*	loadSqliteProducts() {
    	let self = this;

    	if (self.products.length > 0)
      		return;

    	self.products = [];
    	console.log('Loading from db..');
    	self.sqliteService.getProducts().then((data) => {
      		console.log('Found in db: ' + data.rows.length + ' products');
      		if (data.rows.length > 0) {
        		for (var i = 0; i < data.rows.length; i++) {
          			let product: IProducts = {
            			key: data.rows.item(i).key,
            			productName: data.rows.item(i).productName,
            			brand: data.rows.item(i).brand,
            			description: data.rows.item(i).description,
            			qty: data.rows.item(i).qty,
            			rate: data.rows.item(i).rate,
    					amount: data.rows.item(i).amount,
    					subject: data.rows.item(i).subject,
            			user: { uid: data.rows.item(i).user, username: data.rows.item(i).username }
          			};

          			self.products.push(product);
          			console.log('Product added from db:' + product.key);
          			console.log(product);
        		}
        		self.loading = false;
      		}
    	}, (error) => {
      		console.log('Error: ' + JSON.stringify(error));
      		self.loading = true;
    	});
  	} */

  	public networkConnected = (connection) => {
    	console.log('Qpi Page : networkConnected ');
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

  	public onQpiChangeReload = (childSnapshot, prevChildKey) => {
      	console.log('Qpi Page : onQpiChangeReload ');
      	var self = this;
      	self.loadProducts();
    }

  	// Notice function declarion to keep the right this reference
  	public onProductAdded = (childSnapshot, prevChildKey) => {
      	console.log('Product Page : onProductAdded ');
      	var self = this;
      	self.dataService.getProductsRef().child(childSnapshot.key).once('value').then(function(snapshot) {
        	var status = snapshot.val().status;
        	if (status === 'added') {
        		console.log('ignore Product : status ' + status);
        	} else {
        		console.log('Add Product : status ' + status);
        		self.events.publish('product:created');
        		let key = childSnapshot.key;
        		let newProduct: IProducts = self.mappingsService.getProduct(childSnapshot.val(), key);
        		console.log('onProductAdded : ' + newProduct.productName);
        		self.dataService.setProductImage(key, false);
        		self.dataService.setProductStatus(key, 'added');
        		self.loadProducts();
        	}
      	});
  	}

  	loadProducts() {
    	console.log('Qpi Page : loadProducts ');
    	var self = this;
    	self.loading = true;
      	self.products = [];
      	self.newProducts = [];
      	self.getProducts();
  	}

  	getProducts() {
    	console.log('Qpi Page : getProducts ');
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

	public productsReload = () => {
      	console.log('productsReload');
      	var self = this;
      	self.loadProducts();
    }

  	createProduct() {
    	console.log('Qpi Page : createProduct ');
    	var self = this;
    
    	let modalPage = this.modalCtrl.create(ProductCreatePage);

    	modalPage.onDidDismiss((data: any) => {
      		if (data) {
        		let toast = this.toastCtrl.create({
          			message: 'Product created',
          			duration: 3000,
          			position: 'bottom'
        		});
        		toast.present();
      		}
    	});
    	
    	modalPage.present();
      
  	}


  	notify(message: string) {
    	console.log('Qpi Page : notify ');
    	let toast = this.toastCtrl.create({
      		message: message,
      		duration: 3000,
      		position: 'top'
    	});
    	toast.present();
  	}

  	modifyProduct(key: string) 
  	{
      	console.log('Modify product: ' + key);
      	if (this.internetConnected) {
        	this.navCtrl.push(ProductModifyPage, {
          		productKey: key
        	});
      	} else {
        	this.notify('Network not found..');
      	}
    }

    public productImageUpload = (key) => {
      	console.log('Image uploaded'+ key);
      	var self = this;
      	self.openImageOptions(key);
    }

    openImageOptions(key: string) 
    {
    	var self = this;

    	let actionSheet = self.actionSheeCtrl.create({
      		title: 'Upload new image from',
      		buttons: [
        		{
          			text: 'Camera',
          			icon: 'camera',
          			handler: () => {
            			self.openCamera(Camera.PictureSourceType.CAMERA, key);
          			}
        		},
        		{
          			text: 'Album',
          			icon: 'folder-open',
          			handler: () => {
            			self.openCamera(Camera.PictureSourceType.PHOTOLIBRARY, key);
          			}
        		}
      		]
    	});

    	actionSheet.present();
  	}

  	openCamera(pictureSourceType: any, key: string) {
    	var self = this;

    	let options: CameraOptions = {
      		quality: 95,
      		destinationType: Camera.DestinationType.DATA_URL,
      		sourceType: pictureSourceType,
      		encodingType: Camera.EncodingType.PNG,
      		targetWidth: 400,
      		targetHeight: 400,
      		saveToPhotoAlbum: true,
      		correctOrientation: true
    	};

    	Camera.getPicture(options).then(imageData => {
      		const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        		const byteCharacters = atob(b64Data);
        		const byteArrays = [];

        		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          			const slice = byteCharacters.slice(offset, offset + sliceSize);

          			const byteNumbers = new Array(slice.length);
          			for (let i = 0; i < slice.length; i++) {
            			byteNumbers[i] = slice.charCodeAt(i);
          			}

          			const byteArray = new Uint8Array(byteNumbers);

          			byteArrays.push(byteArray);
        		}

        		const blob = new Blob(byteArrays, { type: contentType });
        		return blob;
      		};

      		let capturedImage: Blob = b64toBlob(imageData, 'image/png');
      		self.startUploading(capturedImage, key);
    	}, error => {
      		console.log('ERROR -> ' + JSON.stringify(error));
    	});
  	}

    startUploading(file, key: string) 
    {

    	let self = this;
    	let uid = self.authService.getLoggedInUser().uid;
    	let progress: number = 0;
    	// display loader
    	let loader = this.loadingCtrl.create({
      		content: 'Uploading image..',
    	});
    	loader.present();

    	// Upload file and metadata to the object 'images/mountains.jpg'
    	var metadata = {
      		contentType: 'image/png',
      		name: 'product.png',
      		cacheControl: 'no-cache',
    	};

    	var uploadTask = self.dataService.getStorageRef().child('images/products/' + key + '/product.png').put(file, metadata);

    	// Listen for state changes, errors, and completion of the upload.
    	uploadTask.on('state_changed',
      	function (snapshot) {
        	// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        	progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      	}, function (error) {
        	loader.dismiss().then(() => {
          		switch (error.code) {
            		case 'storage/unauthorized':
              		// User doesn't have permission to access the object
              		break;

            		case 'storage/canceled':
              		// User canceled the upload
              		break;

            		case 'storage/unknown':
              		// Unknown error occurred, inspect error.serverResponse
              		break;
          		}
        	});
      	}, function () {
        	loader.dismiss().then(() => {
          		// Upload completed successfully, now we can get the download URL
          		var downloadURL = uploadTask.snapshot.downloadURL;
          		self.dataService.setProductImage(key,true);
          		self.loadProducts();
        	});
      });
  	}
}
