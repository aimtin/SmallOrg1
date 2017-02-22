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
import { QpiItemSettingsPage } from '../pages/qpi-item-settings/qpi-item-settings';
import { QuotationPage } from '../pages/quotation/quotation';
import { PoPage } from '../pages/po/po';
import { TaxPage } from '../pages/tax/tax';

import { OrgsPage } from '../pages/orgs/orgs';
import { OrgCreatePage } from '../pages/org-create/org-create';
import { OrgModifyPage } from '../pages/org-modify/org-modify';

//Components
import { OrgComponent } from '../shared/components/org.component';
import { OrgAvatarComponent } from '../shared/components/org-avatar.component';
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
    QuotationPage,
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
    QuotationPage,
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
