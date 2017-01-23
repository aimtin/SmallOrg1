import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MenuPagePage } from '../pages/menu-page/menu-page';
import { OrgSettingsPage } from '../pages/org-settings/org-settings';
import { QpiItemSettingsPage } from '../pages/qpi-item-settings/qpi-item-settings';
import { QuotationPage } from '../pages/quotation/quotation';
import { PoPage } from '../pages/po/po';
import { TaxPage } from '../pages/tax/tax';
import { ListBrandPage } from '../pages/list-brand/list-brand';
import { ListQpiItemPage } from '../pages/list-qpi-item/list-qpi-item';
import { ListItemPage } from '../pages/list-item/list-item';
import { ListItemDetailPage } from '../pages/list-item-detail/list-item-detail';
import { ListOrgPage } from '../pages/list-org/list-org';
import { ListOrgDetailPage } from '../pages/list-org-detail/list-org-detail';
import { QuotationCartPage } from '../pages/quotation-cart/quotation-cart';
import { QuotationCartDetailsPage } from '../pages/quotation-cart-details/quotation-cart-details';
import { Storage } from '@ionic/storage';
import { Data } from '../providers/data';
import { Orgdata } from '../providers/orgdata';
import { QpiData } from '../providers/qpi-data';
import { BrandData } from '../providers/brand-data';
import { QuoData } from '../providers/quo-data';

@NgModule({
  declarations: [
    MyApp,
    MenuPagePage,
	OrgSettingsPage,
    QpiItemSettingsPage,
    QuotationPage,
	PoPage,
	TaxPage,
	ListItemPage,
	ListItemDetailPage,
	ListOrgPage,
	ListOrgDetailPage,
	ListBrandPage,
	ListQpiItemPage,
	QuotationCartPage,
	QuotationCartDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPagePage,
	OrgSettingsPage,
    QpiItemSettingsPage,
    QuotationPage,
	PoPage,
	TaxPage,
	ListItemPage,
	ListItemDetailPage,
	ListOrgPage,
	ListOrgDetailPage,
	ListBrandPage,
	ListQpiItemPage,
	QuotationCartPage,
	QuotationCartDetailsPage
  ],
  //providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
  providers: [Storage, Data, Orgdata, QpiData, BrandData, QuoData]
})
export class AppModule {}
