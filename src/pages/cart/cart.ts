
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
import * as pdfmake from 'pdfmake/build/pdfmake';

import { InvoiceService } from '../../shared/services/invoice.service';
import { ViewPDF } from './pdf-viewer';


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
        public navCtrl: NavController,
        public invoiceService: InvoiceService) 
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


    public OpenPdf() {
    var dd = { content: ' Winteches INVOICE' };
         pdfmake.createPdf(dd).open();
     }


    public DownloadPdf() {
     var dd = { content: 'Winteches INVOICE' };
      pdfmake.createPdf(dd).download();
       }
     
 



    getGrandTotal(): number{
   var amount = 0;
   for(var i = 0; i < this.products.length; i++){
    amount += (this.products[i].rate * this.products[i].qty);
    }
  return amount;
   }


  
   otherShare(){
    SocialSharing.share("Your Invoice is attached",null/*Subject*/,null/*File*/,"Share")
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


 onCreateInvoice = function () {
    let invoice = this.getQuotData();
    var self = this;

    this.invoiceService.createPdf(invoice)
      .then(function(pdf) {
        let blob = new Blob([pdf], {type: 'application/pdf'});
        let pdfUrl = {pdfUrl: URL.createObjectURL(blob)};
        let modal = self.modalCtrl.create(ViewPDF, pdfUrl);

        // Display the modal view
        modal.present();
      });
  }


   
getOrgDetails(orgKey: string)
      {
        var self = this;
        self.dataService.getOrg(orgKey).then(function (snap) {
        let newOrg: IOrganisations = self.mappingsService.getOrg(snap.val(), self.product.orgKey);
        console.log('Product Org Name' + newOrg.orgName);
        return newOrg;
      }, function (error) {
        return null;
      });
     }




  getQuotData()
     {
     var self = this;
        
          
     let data: any = {
     Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),

      AddressFrom: {
            Name: 'Fred Lahode',
            Address: 'Chemin Ernest Pisteur',
            Country: 'Suisse'
        },
        AddressTo: {
            Name: 'Maha Lahode',
            Address: 'Chemin Ernest Pisteur 11',
            Country: 'Suisse'
        },
        Items: [
            { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
            { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
        ],
        Subtotal: '€2010',
        Shipping: '€6',
        Total: '€2016'



     }

     




     }

 /* getDummyData() {  
    return {
        Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),
        AddressFrom: {
            Name: 'Fred Lahode',
            Address: 'Chemin Ernest Pisteur',
            Country: 'Suisse'
        },
        AddressTo: {
            Name: 'Maha Lahode',
            Address: 'Chemin Ernest Pisteur 11',
            Country: 'Suisse'
        },
        Items: [
            { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
            { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
        ],
        Subtotal: '€2010',
        Shipping: '€6',
        Total: '€2016'
    };
  }  */
      
}
