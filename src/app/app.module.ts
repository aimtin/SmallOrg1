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
import { OrgsPage } from '../pages/orgs/orgs';
import { OrgCreatePage } from '../pages/org-create/org-create';

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
    OrgsPage,
    OrgCreatePage,
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
    OrgsPage,
    OrgCreatePage,
    OrgComponent,
    OrgAvatarComponent,
    UserAvatarComponent
  ],
  //providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
  providers: [APP_PROVIDERS]
})
export class AppModule {}
