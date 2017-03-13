
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, ToastController, LoadingController, NavParams, Content, Events} from 'ionic-angular';
import { FormBuilder} from '@angular/forms';

import { IProducts } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';

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
    public items: Array<any> = [];
    public total_qty: number = 0;
    public total_amount: number = 0;
    productInfo: {Name: string, Brand: string, Quantity: number, Price: number, Amt: number} = {Name: '', Brand: '', Quantity: 0, Price: 0, Amt: 0};

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
        public alertCtrl: AlertController,
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
      var self = this;
      let confirm = self.alertCtrl.create({
        title: 'Delete Product from Cart',
        message: 'Do you agree to delete product from cart?',
        buttons: [
        {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
        },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
              self.loading = true;
              let tempProducts = self.products;
              let index = tempProducts.indexOf(product);

              if(index > -1){
                tempProducts.splice(index, 1);
              }
              self.products = tempProducts;
              self.loading = false;
            }
          }
        ]
      });
      confirm.present();

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

  getQuotData()
  {
      var self = this;
      self.products.forEach(product => {
        self.productInfo = {
          Name: product.productName,
          Brand: product.brand,
          Quantity: product.qty,
          Price: product.rate,
          Amt: product.amount
        };
        self.items.push(self.productInfo);
      });   
          
      let data: any = {
        Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),

        AddressTo: {
          Name: '        ',
          Address: '     '
          
        },
        Items: self.items,
        Subtotal: '€2010',
        Shipping: '€6',
        Total: '€2016'

      };
      return data;

  }
}

       

