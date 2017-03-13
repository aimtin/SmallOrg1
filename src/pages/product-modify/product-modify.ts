import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController, NavParams, Content } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IOrganisations, IProducts } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';



@Component({
  selector: 'page-product-modify',
  templateUrl: 'product-modify.html'
})
export class ProductModifyPage implements OnInit{

    modifyProductForm: FormGroup;
    name: AbstractControl;
    brand: AbstractControl;
    orgName: AbstractControl;
    description: AbstractControl;
    qty: AbstractControl;
    rate: AbstractControl;
    amount: AbstractControl;
    subject: AbstractControl;
    public orgs: Array<IOrganisations> = [];
    productInfo: {name: string, brand: string, orgName: string, description: string, qty: number, rate: number, amount: number, subject: string} = {name: '', brand: '', orgName: '', description: '', qty: 0, rate: 0, amount: 0, subject: ''};

    @ViewChild(Content) content: Content;
    productKey: string;
    productLoaded: boolean = false;
    product: IProducts;

    constructor(public actionSheeCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public authService: AuthService,
        public itemsService: ItemsService,
        public dataService: DataService,
        public mappingsService: MappingsService) 
    { }

    ngOnInit() {
        var self = this;
        self.productKey = self.navParams.get('productKey');
        self.productLoaded = false;
        this.loadOrgs();
        
      console.log('in Product create..');

          self.modifyProductForm = self.fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'brand': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'orgName': ['', Validators.compose([Validators.required])],
            'description': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
            'qty': [0, Validators.compose([Validators.required])],
            'rate': [0, Validators.compose([Validators.required])],
            'amount': [0, Validators.compose([Validators.required])],
            'subject': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
        });

        this.name = this.modifyProductForm.controls['name'];
        this.brand = this.modifyProductForm.controls['brand'];
        this.orgName = this.modifyProductForm.controls['orgName'];
        this.description = this.modifyProductForm.controls['description'];
        this.qty = this.modifyProductForm.controls['qty'];
        this.rate = this.modifyProductForm.controls['rate'];
        this.amount = this.modifyProductForm.controls['amount'];
        this.subject = this.modifyProductForm.controls['subject'];

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProductModifyPage');
      this.loadPage();
    }

    loadOrgs() {
      console.log('Org Page : loadOrgs ');
      var self = this;
        self.orgs = [];
        self.getOrgs();
    }

    getOrgs() {
      console.log('Org Page : getOrgs ');
      var self = this;
      self.orgs = [];
      self.dataService.getUserOrgs(self.authService.getLoggedInUser().uid)
      .then(function (snapshot) {
          self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot)).forEach(function (org) {
              self.orgs.push(org);
          });
        });
    }

    loadPage(){
      console.log('loadPage');
      var self = this;
      self.dataService.getProduct(self.productKey).then(function (snapshot) {
          console.log('ngOnInit productLoaded');
          self.product = snapshot.val();
          //self.product = self.mappingsService.getProduct(snapshot.val(), self.productKey);
          console.log('Product Ork key' + self.product.orgKey);
            self.productLoaded = true;
            self.dataService.getOrg(self.product.orgKey).then(function (snap) {
              let newOrg: IOrganisations = self.mappingsService.getOrg(snap.val(), self.product.orgKey);
              console.log('Product Ork Name' + newOrg.orgName);
              self.productInfo = {
                name: self.product.productName,
                brand: self.product.brand,
            orgName: newOrg.orgName,
            description: self.product.description,
            qty: self.product.qty,
            rate: self.product.rate,
            amount: self.product.amount,
            subject: self.product.subject
              };
            }, function (error) {});

        }, function (error) {});

    }

    onSubmit(product: any): void {
      var self = this;
      if (this.modifyProductForm.valid) {

          let loader = this.loadingCtrl.create({
            content: 'Posting Product...',
            dismissOnPageChange: true
          });

          loader.present();

          let uid = self.authService.getLoggedInUser().uid;
          self.dataService.getUsername(uid).then(function (snapshot) {
            //let username = snapshot.val();
            self.dataService.getUserOrgs(self.authService.getLoggedInUser().uid)
          .then(function (snapshot1) {

            self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot1)).forEach(function (org) 
              {
                  if(org.orgName === product.orgName)
                  {

                self.dataService.updateProduct(self.productKey, org.key, product);
                    loader.dismiss();
                    //self.loadPage();
                  }
                });

          });
              
          });
      }
    }

}