import { Component, OnInit, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import { NavController, AlertController, ModalController, ToastController, Content, Events, LoadingController, ActionSheetController} from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';

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
    public actionSheeCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
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
    //this.dataService.getOrgsRef().orderByChild('user/uid').equalTo(this.authService.getLoggedInUser().uid).off('child_removed');
    this.events.unsubscribe('org:deleted', this.onDelete);
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
    self.events.subscribe('image:created', self.orgImageUpload);
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
      //self.dataService.getOrgsRef().orderByChild('user/uid').equalTo(self.authService.getLoggedInUser().uid).on('child_removed', self.onChangeReload);
      self.events.subscribe('org:deleted', self.onDelete);
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

    /*public onChangeReload = (childSnapshot, prevChildKey) => {
      console.log('Org Page : onChangeReload ');
      var self = this;
      self.loadOrgs();
    }*/
    public onDelete = (key) => {
      console.log('Org Page : onDelete ' + key);
      var self = this;
      let confirm = self.alertCtrl.create({
        title: 'Delete Organisation',
        message: 'Do you agree to delete organisation?',
        buttons: [
        {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
        },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
              self.dataService.deleteOrg(key).then(function (snapshot) {
                  console.log('Deleted');
                  self.loadOrgs();
              });
              
              
            }
          }
        ]
      });
    confirm.present();
    console.log('Present');
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
    
    let modalPage = self.modalCtrl.create(OrgCreatePage);

    modalPage.onDidDismiss((data: any) => {
      if (data) {
        let toast = self.toastCtrl.create({
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

    public orgImageUpload = (key) => {
      console.log('Image uploaded'+ key);
      var self = this;
      self.openImageOptions(key);
    }

    openImageOptions(key: string) {
    var self = this;

    let actionSheet = self.actionSheeCtrl.create({
      title: 'Upload new image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            self.openCamera(Camera.PictureSourceType.CAMERA, key);
          }
        },
        {
          text: 'Album',
          icon: 'folder-open',
          handler: () => {
            self.openCamera(Camera.PictureSourceType.PHOTOLIBRARY, key);
          }
        }
      ]
    });

    actionSheet.present();
  }

  openCamera(pictureSourceType: any, key: string) {
    var self = this;

    let options: CameraOptions = {
      quality: 95,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    Camera.getPicture(options).then(imageData => {
      const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };

      let capturedImage: Blob = b64toBlob(imageData, 'image/png');
      self.startUploading(capturedImage, key);
    }, error => {
      console.log('ERROR -> ' + JSON.stringify(error));
    });
  }
    startUploading(file, key: string) {

    let self = this;
    //let uid = self.authService.getLoggedInUser().uid;
    let progress: number = 0;
    // display loader
    let loader = this.loadingCtrl.create({
      content: 'Uploading image..',
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
          // Upload completed successfully, now we can get the download URL
          //var downloadURL = uploadTask.snapshot.downloadURL;
          self.dataService.setOrgImage(key,true);
          self.loadOrgs();
        });
      });
  }

}