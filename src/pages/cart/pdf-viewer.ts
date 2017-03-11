import { Component } from '@angular/core';

import { ViewController, NavParams } from "ionic-angular";

@Component({
  template: `

   <ion-header>

  <ion-navbar no-border-bottom color="primary">
    <ion-title>Quotation</ion-title>
      <ion-buttons end>
      <button ion-button color = "danger" (click)="onClose()" icon-only>
        <ion-icon name="close-circle"></ion-icon>
    
      </button>
    </ion-buttons>
  </ion-navbar>

</ion-header>


    <ion-content padding text-center>
      <pdf-viewer [src]="pdfUrl" 
                  [page]="page" 
                  [original-size]="false" 
                  style="display: block;"></pdf-viewer>
    </ion-content>
  `
})
export class ViewPDF {

  pdfUrl: string;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) { }

  ionViewDidLoad() {
    this.pdfUrl = this.navParams.get('pdfUrl');
  }

  onClose(remove = false) {
    this.viewCtrl.dismiss(remove);
  }

}