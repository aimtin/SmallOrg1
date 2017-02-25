import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SmallOrgApp } from './app.component';
//Pages
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { MenuPagePage } from '../pages/menu-page/menu-page';

import { QuotationPage } from '../pages/quotation/quotation';
import { CartPage } from '../pages/cart/cart';
import { PoPage } from '../pages/po/po';
import { TaxPage } from '../pages/tax/tax';

import { OrgsPage } from '../pages/orgs/orgs';
import { OrgCreatePage } from '../pages/org-create/org-create';
import { OrgModifyPage } from '../pages/org-modify/org-modify';

import { QpiItemSettingsPage } from '../pages/qpi-item-settings/qpi-item-settings';
import { ProductCreatePage } from '../pages/product-create/product-create';
import { ProductModifyPage } from '../pages/product-modify/product-modify';

//Components
import { OrgComponent } from '../shared/components/org.component';
import { OrgAvatarComponent } from '../shared/components/org-avatar.component';
import { ProductComponent } from '../shared/components/product.component';
import { ProductList } from '../shared/components/product.list';
import { ProductQuotation } from '../shared/components/product.quotation';
import { ProductAvatarComponent } from '../shared/components/product-avatar.component';
import { UserAvatarComponent } from '../shared/components/user-avatar.component';

// providers
import { APP_PROVIDERS } from '../providers/app.providers';

@NgModule({
  declarations: [
    SmallOrgApp,
    LoginPage,
    ProfilePage,
    SignupPage,
    MenuPagePage,
    QpiItemSettingsPage,
    ProductCreatePage,
    ProductModifyPage,
    ProductComponent,
    ProductList,
    ProductQuotation,
    ProductAvatarComponent,
    QuotationPage,
    CartPage,
    PoPage,
    TaxPage,
    OrgsPage,
    OrgCreatePage,
    OrgModifyPage,
    OrgComponent,
    OrgAvatarComponent,
    UserAvatarComponent
  ],
  imports: [
    IonicModule.forRoot(SmallOrgApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmallOrgApp,
    LoginPage,
    ProfilePage,
    SignupPage,
    MenuPagePage,
    QpiItemSettingsPage,
    ProductCreatePage,
    ProductModifyPage,
    ProductComponent,
    ProductList,
    ProductQuotation,
    ProductAvatarComponent,
    QuotationPage,
    CartPage,
    PoPage,
    TaxPage,
    OrgsPage,
    OrgCreatePage,
    OrgModifyPage,
    OrgComponent,
    OrgAvatarComponent,
    UserAvatarComponent
  ],
  //providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
  providers: [APP_PROVIDERS]
})
export class AppModule {}
