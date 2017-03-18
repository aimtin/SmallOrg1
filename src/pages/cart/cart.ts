
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, ToastController, LoadingController, NavParams, Content, Events} from 'ionic-angular';
import { FormBuilder} from '@angular/forms';

import { IProducts } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';

import { NavController, Platform } from 'ionic-angular';
import { SocialSharing, File, Transfer } from 'ionic-native';
import * as pdfmake from 'pdfmake/build/pdfmake';

import { InvoiceService } from '../../shared/services/invoice.service';
import { ViewPDF } from './pdf-viewer';
declare var cordova:any;


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
     
      alert("Currently Not Support");
       
     
     }
 



  getGrandTotal(): number{
    var amount = 0;
    for(var i = 0; i < this.products.length; i++){
      amount += (this.products[i].rate * this.products[i].qty);
    }
    return amount;
  }

   getTotalQty(): number{
    var TotQty = 0;
    for(var i = 0; i < this.products.length; i++){
      TotQty += this.products[i].qty;
    }
    return TotQty;
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





onDownloadInvoice = function () {
   var self = this;

   self.platform.ready().then(() => {

//  const imageLocation = `${cordova.file.applicationDirectory}www/assets/imges/`;


  let invoice = this.getQuotData();
  

    self.invoiceService.downloadPdf(invoice)
      .then(function(snap) {
      console.log("Write success");
        alert("Saving is successful.")
 
      });

      });

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



/*

  DownloadPDF = function () {

  let invoice = this.getQuotData();
  
    this.pdf = pdfmake;
    let data;
    let file = "Invoice.pdf";
    

   var dd = this.invoiceService.createDocumentDefinition(invoice);
   //requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    this.pdf.createPdf(dd).getBuffer((buffer) => {
      data = this.toArrayBuffer(buffer);
      console.log("newPDF: " + data);
      console.log("newPDF: " + data);
      console.log(cordova.file.dataDirectory + file);
    //  File.removeFile(cordova.file.dataDirectory, file);
      File.writeFile(cordova.file.dataDirectory, file, data, true).then(() => {
        // Success!
        console.log("writeFile: success!");
        alert("Failure");
       
      }).catch((err) => {
        // Error!
        console.log("writeFile: fail!  " + JSON.stringify(err));
        alert("Success");
      });
    });
   
  }
*/

/*

//Testing

  DownloadPDF = function () {

  let invoice = this.getQuotData();
  
    this.pdf = pdfmake;
    let data;
   // let file = "Quotation.pdf";
    

   var dd = this.invoiceService.createDocumentDefinition(invoice);
   //var dd= <my pdfmake content here>;

var folder = "pdfwin";
var appDirectory;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 1, function(fileSys){
        fileSys.root.getDirectory(folder, {create:true, exclusive: false}, function(directory){
            appDirectory = directory;
            console.log("App directory initialized.");
    }, fail);   
 }, fail);

function fail(error) {
     console.log("App directory Error: "+error.code);
}

this.pdf.createPdf(dd).getBuffer(function (buffer) {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...                
        binaryArray = utf8.buffer; // Convert to Binary...
        save(binaryArray,"Test.pdf")
});

function save(data,savefile){
    var html = savefile;
    appDirectory.getFile(html, {create:true, exclusive: false}, function(fileEntry){
        fileEntry.createWriter(win,fail);
    }, fail);

    function win(writer) {
        writer.onwriteend = function(evt) {
            if (writer.length === 0) {
                writer.write(data);
            } else { }
        };
        writer.truncate(0);
        console.log("Write success");
        alert("Saving is successful.")
    };

    function fail(error) {
        console.log("Writer Error: "+error.code);
    }
}


   
  }   */



sharePdfEmail = function () {

  let invoice = this.getQuotData();
  
    this.pdf = pdfmake;
    let data;
    let file = "Quotation.pdf";
    //let newPDF;

   var dd = this.invoiceService.createDocumentDefinition(invoice);

    this.pdf.createPdf(dd).getBuffer((buffer) => {
      data = this.toArrayBuffer(buffer);
      console.log("newPDF: " + data);
      console.log("newPDF: " + data);
      console.log(cordova.file.cacheDirectory + file);
      File.removeFile(cordova.file.cacheDirectory, file);
      File.writeFile(cordova.file.cacheDirectory, file, data, true).then(() => {
        // Success!
        console.log("writeFile: success!");

         SocialSharing.shareVia('com.google.android.gm','Hi,  Your Quotation is attached to this email.', 'INVOICE', cordova.file.cacheDirectory + file,null).then(() => { 
       /* SocialSharing.shareViaEmail('Hi,  Your Quotation is attached to this email.', 'QUOTATION',null,null,null, cordova.file.cacheDirectory + file).then(() => { */ 
          // Success!
          console.log("shareViaEmail: success!")
          alert("Success");
        }).catch((err) => {
          // Error!OTATION
          console.log("shareViaEmail: fail!  " + err)
          alert("Failure");
        });

      }).catch((err) => {
        // Error!
        console.log("writeFile: fail!  " + JSON.stringify(err));
        alert("Failure");
      });
    });
   
  }




//Added code for export pdf

exportPDF = function () {

  let invoice = this.getQuotData();
  
    this.pdf = pdfmake;
    let data;
    let file = "Quotation.pdf";
  

   var dd = this.invoiceService.createDocumentDefinition(invoice);

    this.pdf.createPdf(dd).getBuffer((buffer) => {
      data = this.toArrayBuffer(buffer);
      console.log("newPDF: " + data);
      console.log("newPDF: " + data);
      console.log(cordova.file.cacheDirectory + file);
      File.removeFile(cordova.file.cacheDirectory, file);
      File.writeFile(cordova.file.cacheDirectory, file, data, true).then(() => {
        // Success!
        console.log("writeFile: success!");
     SocialSharing.share("Your Quotation is Shared Here",null/*Subject*/,cordova.file.cacheDirectory + file).then(() => { 
          // Success!
          console.log("shareViaEmail: success!")
          alert("Success");
        }).catch((err) => {
          // Error!
          console.log("shareViaEmail: fail!  " + err)
          alert("Failure");
        });

      }).catch((err) => {
        // Error!
        console.log("writeFile: fail!  " + JSON.stringify(err));
        alert("Failure");
      });
    });
   
  }

  toArrayBuffer(buf) {
    let ab = new ArrayBuffer(buf.length);
    let view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  }








  getQuotData()
     {
     var self = this;
     var Tot = self.getGrandTotal();
     var TotQty = self.getTotalQty();
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
        
        TotalQty: TotQty,
        TotalAmt:    Tot
        
        };
        return data;

     }

     

     }




