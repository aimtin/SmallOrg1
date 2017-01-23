import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
//import { FormBuilder, Validators, AbstractControl, ControlGroup } from '@angular2/common';
//import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { ListOrgPage } from '../list-org/list-org';
import { ListOrgDetailPage } from '../list-org-detail/list-org-detail';
import { Orgdata } from '../../providers/orgdata';
/*
  Generated class for the OrgSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-org-settings',
  templateUrl: 'org-settings.html'
})
export class OrgSettingsPage {
  public orgs = [];
 
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Orgdata) {
 
    this.dataService.getData().then((orgs) => {
       if(orgs){
        this.orgs = JSON.parse(orgs); 
      }
     });
 
  }
 
  ionViewDidLoad(){
	//this.dataService.deleteAll();
  }
 
  addOrg(){
     let addModal = this.modalCtrl.create(ListOrgPage);
     addModal.onDidDismiss((org) => {
           if(org){
            this.saveOrg(org);
          }
     });
    addModal.present();
  }
 
  saveOrg(org){
    this.orgs.push(org);
    this.dataService.save(this.orgs);
  }
 
  viewOrg(org){
    this.navCtrl.push(ListOrgDetailPage, {
      org: org
    });
  }
}

