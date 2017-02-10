import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events, LoadingController} from 'ionic-angular';

import { IOrganisations } from '../../shared/interfaces';
import { OrgCreatePage } from '../org-create/org-create';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';

@Component({
  templateUrl: 'orgs.html'
})
export class OrgsPage implements OnInit {
  @ViewChild(Content) content: Content;
  queryText: string = '';
  public start: number;
  public pageSize: number = 3;
  public loading: boolean = true;
  public internetConnected: boolean = true;

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
    this.loadOrgPage();
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
      self.dataService.getStatisticsRef().on('child_changed', self.onOrgAdded);
      if (self.authService.getLoggedInUser() === null) {
        //
      } else {
        self.loadOrgs(true);
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
      self.loadOrgs(true);
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

  // Notice function declarion to keep the right this reference
  public onOrgAdded = (childSnapshot, prevChildKey) => {
    console.log('Org Page : onOrgAdded ');
    let priority = childSnapshot.val(); // priority..
    var self = this;
    self.events.publish('org:created');
    // fetch new org..
    self.dataService.getOrgsRef().orderByPriority().equalTo(priority).once('value').then(function (dataSnapshot) {
      let key = Object.keys(dataSnapshot.val())[0];
      let newOrg: IOrganisations = self.mappingsService.getOrg(dataSnapshot.val()[key], key);
      self.newOrgs.push(newOrg);
      self.CreateAndUploadDefaultImage(newOrg);
      
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
    self.scrollToTop();
    //self.loadOrgs(true);
    
  }

  loadOrgs(fromStart: boolean) {
    console.log('Org Page : loadOrgs ');
    var self = this;

    if (fromStart) {
      self.loading = true;
      self.orgs = [];
      self.newOrgs = [];
      this.dataService.getTotalOrgs().then(function (snapshot) {
          self.start = snapshot.val();
          self.getOrgs();
        });
    } else {
      self.getOrgs();
    }
  }

  getOrgs() {
    console.log('Org Page : getOrgs ');
    var self = this;
    let startFrom: number = self.start - self.pageSize;
    if (startFrom < 0)
      startFrom = 0;
      this.dataService.getOrgsRef().orderByPriority().startAt(startFrom).endAt(self.start).once('value', function (snapshot) {
        self.itemsService.reversedItems<IOrganisations>(self.mappingsService.getOrgs(snapshot)).forEach(function (org) {
          self.orgs.push(org);
        });
        self.start -= (self.pageSize + 1);
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

        if (data.priority === 1)
          self.newOrgs.push(data.org);

        //self.addNewOrgs();
      }
    });

    modalPage.present();
  }

  fetchNextOrgs(infiniteScroll) {
    console.log('Org Page : fetchNextOrgs ');
    if (this.start > 0 && this.internetConnected) {
      this.loadOrgs(false);
      infiniteScroll.complete();
    } else {
      infiniteScroll.complete();
    }
  }

  scrollToTop() {
    console.log('Org Page : scrollToTop ');
    var self = this;
    setTimeout(function () {
      self.content.scrollToTop();
    }, 1500);
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

      CreateAndUploadDefaultImage(org) {
        console.log('Org Page : CreateAndUploadDefaultImage ');
        let self = this;
        let imageData = 'assets/images/org.png';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', imageData, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status === 200) {
                var myBlob = this.response;
                // myBlob is now the blob that the object URL pointed to.
                self.startUploading(myBlob,org);
            }
        };
        xhr.send();
    }

    startUploading(file,org) {
        let promise = new Promise((res,rej) => { 
        console.log('Org Page : startUploading ');
        let self = this;
        let key = org.key;
        let progress: number = 0;
        // display loader
        let loader = this.loadingCtrl.create({
            content: 'Uploading default image..',
        });
        loader.present();

        // Upload file and metadata to the object 'images/mountains.jpg'
        var metadata = {
            contentType: 'image/png',
            name: 'org.png',
            cacheControl: 'no-cache',
        };

        var uploadTask = self.dataService.getStorageRef().child('images/organisations/' + key + '/org.png').put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            function (snapshot) {
                console.log('Org Page : uploadTask ');
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, function (error) {
                loader.dismiss().then(() => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                });
            }, function () {
                loader.dismiss().then(() => {
                    console.log('Org Page : uploadTask end');
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    self.dataService.setOrgImage(key);
                    self.addNewOrgs();
                });
            });
        });
        return promise;
    }

}