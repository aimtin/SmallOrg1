import {Component, ViewChild, OnInit } from '@angular/core';
import {Platform, MenuController, ViewController, Events, ModalController } from 'ionic-angular';
import { Network, Splashscreen, StatusBar } from 'ionic-native';
import { Subscription } from '../../node_modules/rxjs/Subscription';

import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';
import { SqliteService } from '../shared/services/sqlite.service';

import { MenuPagePage } from '../pages/menu-page/menu-page';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class SmallOrgApp implements OnInit{
@ViewChild('content') nav: any;

  public rootPage: any;
  public loginPage: LoginPage;

  connectSubscription: Subscription;

  constructor(platform: Platform,
    public dataService: DataService,
    public authService: AuthService,
    public sqliteService: SqliteService,
    public menu: MenuController,
    public events: Events,
    public modalCtrl: ModalController) {
    console.log('SmallOrgApp app.html');
    var self = this;
    this.rootPage = this.loginPage;

    platform.ready().then(() => {
      if (window.cordova) {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        self.watchForConnection();
        self.watchForDisconnect();
        Splashscreen.hide();

        console.log('in ready..');
        let array: string[] = platform.platforms();
        console.log(array);
        self.sqliteService.InitDatabase();
      }
    });
  }

  watchForConnection() {
    var self = this;
    Network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log('we got a connection..');
        console.log('Firebase: Go Online..');
        self.dataService.goOnline();
        self.events.publish('network:connected', true);
      }, 3000);
    });
  }

  watchForDisconnect() {
    var self = this;
    // watch network for a disconnect
    Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('Firebase: Go Offline..');
      //self.sqliteService.resetDatabase();
      self.dataService.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }

  ngOnInit() {
       console.log('SmallOrgApp ngOnInit');
  }

  ngAfterViewInit() {
    var self = this;

    self.authService.onAuthStateChanged(function (user) {
       console.log('SmallOrgApp onAuthStateChanged');
      if (user === null) {
         console.log('SmallOrgApp null');
        self.menu.close();
        //self.nav.setRoot(LoginPage);

        let loginodal = self.modalCtrl.create(LoginPage);
        loginodal.present();
        //self.nav.setRoot(MenuPagePage);
      }
      else {
         console.log('SmallOrgApp else');
         self.nav.setRoot(MenuPagePage);
      }
    });
  }

  openPage(page) {
    console.log('SmallOrgApp openPage');
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'signup') {
       console.log('SmallOrgApp signup');
      if (!(viewCtrl.instance instanceof SignupPage))
        this.nav.push(SignupPage);
    }
  }

  profile(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'profile') {
      if (!(viewCtrl.instance instanceof ProfilePage))
        this.nav.push(ProfilePage);
    }
  }
  signout() {
    var self = this;
    self.menu.close();
    self.authService.signOut();
  }

  isUserLoggedIn(): boolean {
     // console.log('SmallOrgApp isUserLoggedIn');
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}
