import { Component, OnInit } from '@angular/core';
import { Platform, NavController, MenuController , NavParams, Events} from 'ionic-angular';
//import { Platform, Nav } from 'ionic-angular';
import { OrgsPage } from '../orgs/orgs';
import { QpiItemSettingsPage } from '../qpi-item-settings/qpi-item-settings';
import { QuotationPage } from '../quotation/quotation';
import { PoPage } from '../po/po';
import { TaxPage } from '../tax/tax';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'page-menu-page',
  templateUrl: 'menu-page.html'
})
export class MenuPagePage implements OnInit{
	//@ViewChild('myNav') nav: Nav;
	//rootPage: any = OrgSettingsPage;
	pages: Array<{title: string, component: any, icon: string, color: string}>;
	constructor(
	public authService: AuthService,
	public dataService: DataService,
	public platform: Platform,
	public events: Events,
	public menu: MenuController,
	public navCtrl: NavController
	) {

		// set our app's pages
		this.pages = [
			{ title: 'Organisation Settings', component: OrgsPage, icon: 'cog', color: 'secondary'},
			{ title: 'QPI Item Settings', component: QpiItemSettingsPage, icon: 'settings', color: 'danger'},
			{ title: 'Quotation', component: QuotationPage, icon: 'clipboard', color: 'light'},
			{ title: 'PO', component: PoPage, icon: 'paper', color: 'dark'},
			{ title: 'Tax', component: TaxPage, icon: 'logo-usd', color: 'primary' }
		];
	}
	ngOnInit() {
        //this.startListening();
        this.menu.enable(true);
    }
	ionViewDidLoad() {
		this.menu.enable(true);
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
