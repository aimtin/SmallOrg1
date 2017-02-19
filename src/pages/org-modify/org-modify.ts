import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController, NavParams, Content } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IOrganisations } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';
import { SqliteService } from '../../shared/services/sqlite.service';
import { EmailValidator } from '../../shared/validators/email.validator';
/*
  Generated class for the OrgModify page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-org-modify',
  templateUrl: 'org-modify.html'
})
export class OrgModifyPage implements OnInit {
  	modifyOrgForm: FormGroup;
  	name: AbstractControl;
  	address: AbstractControl;
  	email: AbstractControl;
  	orgInfo: {name: string, address: string, email: string } = {name: '', address:'', email: ''};

    @ViewChild(Content) content: Content;
    orgKey: string;
    orgLoaded: boolean = false;
    org: IOrganisations;

    constructor(public actionSheeCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public fb: FormBuilder,
        public authService: AuthService,
        public itemsService: ItemsService,
        public dataService: DataService,
        public mappingsService: MappingsService) { }

    ngOnInit() {
        var self = this;
        self.orgKey = self.navParams.get('orgKey');
        self.orgLoaded = false;

        
    	console.log('in org create..');

    	    self.modifyOrgForm = self.fb.group({
      		'name': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      		'address': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      		'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])]
    		});

    		self.name = self.modifyOrgForm.controls['name'];
    		self.address = self.modifyOrgForm.controls['address'];
    		self.email = self.modifyOrgForm.controls['email'];

    }

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad OrgModifyPage');
    	this.loadPage();
  	}

  	loadPage(){
  		console.log('loadPage');
  		var self = this;
  		self.dataService.getOrg(self.orgKey).then(function (snapshot) {
        	console.log('ngOnInit orgLoaded');
        	self.org = snapshot.val();
            self.orgLoaded = true;

            self.orgInfo = {name: self.org.orgName, address: self.org.address, email: self.org.email};

        }, function (error) {});

  	}

  	onSubmit(org: any): void {
    var self = this;
    if (this.modifyOrgForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting Org...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = self.authService.getLoggedInUser().uid;
      self.dataService.getUsername(uid).then(function (snapshot) {
        let username = snapshot.val();

          self.dataService.updateOrg(self.orgKey, org);
          loader.dismiss();
          self.loadPage();

      });
    }
  }

}
