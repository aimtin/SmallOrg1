import { Component, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";

/*
  Generated class for the ListBrand page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-brand',
  templateUrl: 'list-brand.html'
})
export class ListBrandPage {

	myForm: FormGroup;
	qpiBrand: { brand: string } = { brand: '' };
  constructor(
	public navCtrl: NavController,
	public vc: ViewController,
	public formBuilder: FormBuilder
	) {}

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'brand': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]]
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

  saveItem(){

	let formData = {
		brand : this.myForm.get('brand').value
	}

    this.vc.dismiss(formData);

  }

  close(){
    this.vc.dismiss();
  }

}
