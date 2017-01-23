import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MenuPagePage } from '../pages/menu-page/menu-page';

@Component({
  template : `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = MenuPagePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
