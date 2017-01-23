import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
//import { Platform, Nav } from 'ionic-angular';

import { OrgSettingsPage } from '../org-settings/org-settings';
import { QpiItemSettingsPage } from '../qpi-item-settings/qpi-item-settings';
import { QuotationPage } from '../quotation/quotation';
import { PoPage } from '../po/po';
import { TaxPage } from '../tax/tax';


@Component({
  selector: 'page-menu-page',
  templateUrl: 'menu-page.html'
})
export class MenuPagePage {
	//@ViewChild('myNav') nav: Nav;
	//rootPage: any = OrgSettingsPage;
	pages: Array<{title: string, component: any}>;
	constructor(
	public platform: Platform,
	public navCtrl: NavController
	) {

		// set our app's pages
		this.pages = [
			{ title: 'Organisation Settings', component: OrgSettingsPage },
			{ title: 'QPI Item Settings', component: QpiItemSettingsPage },
			{ title: 'Quotation', component: QuotationPage },
			{ title: 'PO', component: PoPage },
			{ title: 'Tax', component: TaxPage }
		];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MenuPagePage');
	}
  
	openPage(page) {
		// close the menu when clicking a link from the menu
		//this.menu.close();
		// navigate to the new page if it is not the current page
		//this.nav.setRoot(page.component);
		this.navCtrl.push(page.component);
	}

}
