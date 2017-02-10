import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IOrganisations } from '../../shared/interfaces';
import { AuthService } from  '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { EmailValidator } from '../../shared/validators/email.validator';

@Component({
  templateUrl: 'org-create.html'
})
export class OrgCreatePage implements OnInit {

  createOrgForm: FormGroup;
  name: AbstractControl;
  address: AbstractControl;
  email: AbstractControl;

  constructor(public nav: NavController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public authService: AuthService,
    public dataService: DataService) { }

  ngOnInit() {
    console.log('in org create..');
    this.createOrgForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'address': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])]
    });

    this.name = this.createOrgForm.controls['name'];
    this.address = this.createOrgForm.controls['address'];
    this.email = this.createOrgForm.controls['email'];
  }

  cancelNewOrg() {
    this.viewCtrl.dismiss();
  }

  onSubmit(org: any): void {
    var self = this;
    if (this.createOrgForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting Org...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = self.authService.getLoggedInUser().uid;
      self.dataService.getUsername(uid).then(function (snapshot) {
        let username = snapshot.val();

        self.dataService.getTotalOrgs().then(function (snapshot) {
          let currentNumber = snapshot.val();
          let newPriority: number = currentNumber === null ? 1 : (currentNumber + 1);

          let newOrg: IOrganisations = {
            key: null,
            orgName: org.name,
            address: org.address,
            email: org.email,
            user: { uid: uid, username: username }
          };

          self.dataService.submitOrg(newOrg, newPriority)
            .then(function (snapshot) {
              loader.dismiss()
                .then(() => {
                  self.viewCtrl.dismiss({
                    org: newOrg,
                    priority: newPriority
                  });
                });
            }, function (error) {
              // The Promise was rejected.
              console.error(error);
              loader.dismiss();
            });

        });
      });
    }
  }


}
