import { Component, OnInit, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events, LoadingController} from 'ionic-angular';

import { IOrganisations } from '../../shared/interfaces';
import { OrgCreatePage } from '../org-create/org-create';
import { OrgModifyPage } from '../org-modify/org-modify';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';

@Component({
  templateUrl: 'orgs.html'
})
export class OrgsPage implements OnInit, OnChanges, OnDestroy {
  @ViewChild(Content) content: Content;
  queryText: string = '';
  public start: number;
  segment: string = 'all';
  public pageSize: number = 3;
  public loading: boolean = true;
  public internetConnected: boolean = true;
  public refreshFlag: boolean = true;
  public orgs: Array<IOrganisations> = [];
  public newOrgs: Array<IOrganisations> = [];
  
  public firebaseConnectionAttempts: number = 0;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public dataService: DataService,
    public sqliteService: SqliteService,
    public mappingsService: MappingsService,
    public itemsService: ItemsService,
    public loadingCtrl: LoadingController,
    public events: Events) { }

  ngOnInit() {
    console.log('Org Page : ngOnInit ');
    this.loadOrgPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');

  }
  public ngOnChanges(changes) {
    console.log('list changed', changes);
  }

  public ngOnDestroy(){
    console.log('list destroyed');
    this.dataService.getOrgsRef().orderByChild('user/uid').equalTo(this.authService.getLoggedInUser().uid).off('child_removed');
    this.dataService.getOrgsRef().orderByChild('user/uid').equalTo(this.authService.getLoggedInUser().uid).off('child_added');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter page.');
    if (this.refreshFlag === false){
      this.refreshFlag = true;
      this.loadOrgs();
    }
    
  }
  ionViewWillLeave() {
    console.log('ionViewWillLeave page.');
    this.refreshFlag = false;
  }
  loadOrgPage()
  {
    var self = this;
    self.events.subscribe('network:connected', self.networkConnected);
    self.events.subscribe('orgs:add', self.addNewOrgs);
    console.log('Org Page : loadOrgPage ');
    self.checkFirebase();
  }

  checkFirebase() {
    console.log('Org Page : checkFirebase ');
    let self = this;
    if (!self.dataService.isFirebaseConnected()) {
      setTimeout(function () {
        console.log('Retry : ' + self.firebaseConnectionAttempts);
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 5) {
          self.checkFirebase();
        } else {
          self.internetConnected = false;
          self.dataService.goOffline();
          self.loadSqliteOrgs();
        }
      }, 1000);
    } else {
      console.log('Firebase connection found (orgs.ts) - attempt: ' + self.firebaseConnectionAttempts);
      self.dataService.getOrgsRef().orderByChild('user/uid').equalTo(self.authService.getLoggedInUser().uid).on('child_removed', self.onChangeReload);
      self.dataService.getOrgsRef().orderByChild('user/uid').equalTo(self.authService.getLoggedInUser().uid).on('child_added', self.onOrgAdded);
      if (self.authService.getLoggedInUser() === null) {
        //
      } else {
        self.loadOrgs();
      }
    }
  }

  loadSqliteOrgs() {
    let self = this;

    if (self.orgs.length > 0)
      return;

    self.orgs = [];
    console.log('Loading from db..');
    self.sqliteService.getOrgs().then((data) => {
      console.log('Found in db: ' + data.rows.length + ' orgs');
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let org: IOrganisations = {
            key: data.rows.item(i).key,
            orgName: data.rows.item(i).orgName,
            address: data.rows.item(i).address,
            email: data.rows.item(i).email,
            status: data.rows.item(i).status,
            user: { uid: data.rows.item(i).user, username: data.rows.item(i).username }
          };

          self.orgs.push(org);
          console.log('Org added from db:' + org.key);
          console.log(org);
        }
        self.loading = false;
      }
    }, (error) => {
      console.log('Error: ' + JSON.stringify(error));
      self.loading = true;
    });
  }

  public networkConnected = (connection) => {
    console.log('Org Page : networkConnected ');
    var self = this;
    self.internetConnected = connection[0];
    console.log('NetworkConnected event: ' + self.internetConnected);

    if (self.internetConnected) {
      self.orgs = [];
      self.loadOrgs();
    } else {
      self.notify('Connection lost. Working offline..');
      // save current orgs..
      setTimeout(function () {
        console.log(self.orgs.length);
        self.sqliteService.saveOrgs(self.orgs);
        self.loadSqliteOrgs();
      }, 1000);
    }
  }

    public onChangeReload = (childSnapshot, prevChildKey) => {
      console.log('Org Page : onChangeReload ');
      var self = this;
      /*let key = childSnapshot.key;
      self.loading = true;
      let tempOrgs: Array<IOrganisations> = [];
      tempOrgs = self.orgs;
      let newOrg: IOrganisations = self.mappingsService.getOrg(childSnapshot.val(), key);
      let index: number = 0;
      self.orgs = [];
      tempOrgs.forEach(function (org: IOrganisations) {
        index += 1;
        if (newOrg.key === org.key){
          console.log('inderOf :' + index);
          console.log('org.key :' + org.key);
          console.log('newOrg.key :' + newOrg.key);
          tempOrgs.splice( index, 1 );
        }else {
            self.orgs.push(org);
        }
        
      });
      
      self.events.publish('orgs:viewed');
      self.loading = false;*/
      self.loadOrgs();
    }

  // Notice function declarion to keep the right this reference
  public onOrgAdded = (childSnapshot, prevChildKey) => {
      console.log('Org Page : onOrgAdded ');
      var self = this;
      self.dataService.getOrgsRef().child(childSnapshot.key).once('value').then(function(snapshot) {
        var status = snapshot.val().status;
        if (status === 'added') {
          console.log('ignore Org : status ' + status);
        } else {
          console.log('Add Org : status ' + status);
          self.events.publish('org:created');
          let key = childSnapshot.key;
          let newOrg: IOrganisations = self.mappingsService.getOrg(childSnapshot.val(), key);
          console.log('onOrgAdded : ' + newOrg.orgName);
          self.dataService.setOrgImage(key, false);
          self.dataService.setOrgStatus(key, 'added');
          self.loadOrgs();
        }
      });
  }

  public addNewOrgs = () => {
    console.log('Org Page : addNewOrgs ');
    var self = this;
    self.newOrgs.forEach(function (org: IOrganisations) {
      self.orgs.unshift(org);
    });

    self.newOrgs = [];
    
    self.events.publish('orgs:viewed');
  }

  loadOrgs() {
    console.log('Org Page : loadOrgs ');
    var self = this;
    self.loading = true;
      self.orgs = [];
      self.newOrgs = [];
      self.getOrgs();
  }

  getOrgs() {
    console.log('Org Page : getOrgs ');
    var self = this;
    self.orgs = [];
    self.dataService.getUserOrgs(self.authService.getLoggedInUser().uid)
    .then(function (snapshot) {
        self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot)).forEach(function (org) {
          self.orgs.push(org);
        });
        self.events.publish('orgs:viewed');
        self.loading = false;
      });

  }

  createOrg() {
    console.log('Org Page : createOrg ');
    var self = this;
    
    let modalPage = this.modalCtrl.create(OrgCreatePage);

    modalPage.onDidDismiss((data: any) => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Org created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();

      }
    });

    modalPage.present();
    
  }


  notify(message: string) {
    console.log('Org Page : notify ');
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


    modifyOrg(key: string) {
      console.log('Modify org: ' + key);
      if (this.internetConnected) {
        this.navCtrl.push(OrgModifyPage, {
          orgKey: key
        });
      } else {
        this.notify('Network not found..');
      }
    }

}