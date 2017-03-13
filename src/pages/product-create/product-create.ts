import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController, Events} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IOrganisations, IProducts } from '../../shared/interfaces';
import { AuthService } from  '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { ItemsService } from '../../shared/services/items.service';
import { MappingsService } from '../../shared/services/mappings.service';

@Component({
  selector: 'page-product-create',
  templateUrl: 'product-create.html'
})
export class ProductCreatePage implements OnInit{

  	createProductForm: FormGroup;
  	name: AbstractControl;
    brand: AbstractControl;
    orgName: AbstractControl;
    description: AbstractControl;
    qty: AbstractControl;
    rate: AbstractControl;
    amount: AbstractControl;
    subject: AbstractControl;
    public orgs: Array<IOrganisations> = [];

  	constructor(public nav: NavController,
    	public loadingCtrl: LoadingController,
    	public viewCtrl: ViewController,
    	public fb: FormBuilder,
    	public events: Events,
    	public authService: AuthService,
    	public itemsService: ItemsService,
        public dataService: DataService,
        public mappingsService: MappingsService) 
    { }

  	ngOnInit() {
    	console.log('in product create..');
    	this.loadOrgs();
    	this.createProductForm = this.fb.group({
      		'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      		'brand': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      		'orgName': ['', Validators.compose([Validators.required])],
      		'description': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      		'qty': [0, Validators.compose([Validators.required])],
      		'rate': [0, Validators.compose([Validators.required])],
      		'amount': [0, Validators.compose([Validators.required])],
      		'subject': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    	});

    	this.name = this.createProductForm.controls['name'];
    	this.brand = this.createProductForm.controls['brand'];
    	this.orgName = this.createProductForm.controls['orgName'];
    	this.description = this.createProductForm.controls['description'];
    	this.qty = this.createProductForm.controls['qty'];
    	this.rate = this.createProductForm.controls['rate'];
    	this.amount = this.createProductForm.controls['amount'];
    	this.subject = this.createProductForm.controls['subject'];
  	}

  	cancelNewProduct() {
    	this.viewCtrl.dismiss();
  	}

  	loadOrgs() {
    	console.log('Product Page : loadOrgs ');
    	var self = this;
      	self.orgs = [];
      	self.getOrgs();
  	}

  	getOrgs() {
    	console.log('Product Page : getOrgs ');
    	var self = this;
    	self.orgs = [];
    	self.dataService.getUserOrgs(self.authService.getLoggedInUser().uid)
    	.then(function (snapshot) {
        	self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot)).forEach(function (org) {
          		self.orgs.push(org);
        	});
      	});
  	}

  	onSubmit(product: any): void {
    	var self = this;
    	if (this.createProductForm.valid) {

      		let loader = this.loadingCtrl.create({
        		content: 'Posting Product...',
        		dismissOnPageChange: true
      		});

      		loader.present();

      		let uid = self.authService.getLoggedInUser().uid;
      		self.dataService.getUsername(uid).then(function (snapshot) {
        		let username = snapshot.val();
        		self.dataService.getUserOrgs(self.authService.getLoggedInUser().uid)
    			.then(function (snapshot1) {
    				 
        			self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot1)).forEach(function (org) 
        			{
          				if(org.orgName === product.orgName)
          				{
          					let newProduct: IProducts = {
            					key: null,
            					productName: product.name,
            					brand: product.brand,
    							orgKey: org.key,
    							description: product.description,
    							qty: product.qty,
    							rate: product.rate,
    							amount: product.amount,
    							subject: product.subject,
            					user: { uid: uid, username: username }
          					};

          					self.dataService.submitProduct(newProduct)
            				.then(function (snapshot2) {
              					loader.dismiss()
                				.then(() => {
                  					self.viewCtrl.dismiss({
                    					product: newProduct
                  					});
                  					self.events.publish('product:created');
                				});
            				}, function (error) {
              					// The Promise was rejected.
              					console.error(error);
              					loader.dismiss();
            				});
          				}
        			});
      			});
      		});
    	}
  	}
}
 