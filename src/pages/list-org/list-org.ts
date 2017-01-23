import { Component, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
/*
  Generated class for the ListOrg page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-org',
  templateUrl: 'list-org.html'
})
export class ListOrgPage implements OnInit{

	myForm: FormGroup;
	orgInfo: {name: string, address: string, email: string } = {name: '', address:'', email: ''};
  constructor(
	public navCtrl: NavController,
	public vc: ViewController,
	public formBuilder: FormBuilder
	) {}

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
      'address': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
      'email': ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }

  onSubmit() {
    console.log('submitting form');
  }

  isValid(field: string) {
    let formField = this.myForm.get(field);
    return formField.valid || formField.pristine;
  }

  nameValidator(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("^[a-zA-Z ,.'-]+$")) {
      return {invalidName: true};
    }
  }

  emailValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value.toLowerCase().match('^[a-zA-Z]\\w*@gmail\\.com$') || control.value.toLowerCase().match('^[a-zA-Z]\\w*@yahoo\\.com$'))) {
      return {invalidEmail: true};
    }
  }  

  saveItem(){

	let formData = {
		name : this.myForm.get('name').value,
		address : this.myForm.get('address').value,
		email : this.myForm.get('email').value
	}
		
    this.vc.dismiss(formData);

  }

  close(){
    this.vc.dismiss();
  }
  
}
