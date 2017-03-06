
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController, NavParams, Content, Events} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IOrganisations, IProducts } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';
import { EmailValidator } from '../../shared/validators/email.validator';

import { NavController } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';


@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
    @ViewChild(Content) content: Content;
    public loading: boolean = true;
    public internetConnected: boolean = true;
    public refreshFlag: boolean = true;
    public products: Array<IProducts> = [];
    public total_qty: number = 0;
    public total_amount: number = 0;

    constructor(public actionSheeCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public authService: AuthService,
        public itemsService: ItemsService,
        public dataService: DataService,
        public mappingsService: MappingsService,
        public events: Events,
        public navCtrl: NavController) 
    { }

    
  ngOnInit()
  {
        var self = this;
        self.products = self.navParams.get('productList');
        self.loading = false;
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad CartPage');
    }

    deleteProduct(product: any) {

      console.log("deleteProduct" + product.key);

    }

  
   otherShare(){
    SocialSharing.share("Genral Share Sheet",null/*Subject*/,null/*File*/,"http://pointdeveloper.com")
    .then(()=>{
        alert("Success");
      },
      ()=>{
         alert("failed")
      })
 
  }


  shareEmail(){
  SocialSharing.shareViaEmail('Hi,  Your Invoice is attached to this email.', 'INVOICE', null).then(() => {
  alert("Success");
},
()=>{
   alert("Failed")
  

})
}

      
}
