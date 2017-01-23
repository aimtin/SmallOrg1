import { Component, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
/*
  Generated class for the ListItem page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-item',
  templateUrl: 'list-item.html'
})
export class ListItemPage {
	myForm: FormGroup;
	qpiInfo: { product: string, descriptions: string, qty: number, rate: number, amount: number } = 
			{ product: '', descriptions: '', qty: 0, rate: 0, amount: 0 };
  constructor(
	public navCtrl: NavController,
	public vc: ViewController,
	public formBuilder: FormBuilder
	) {}

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'product': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
      'descriptions': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
	  'qty': ['', [Validators.required]],
	  'rate': ['', [Validators.required]],
	  'amount': ['', [Validators.required]]
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
		product : this.myForm.get('product').value,
		descriptions : this.myForm.get('descriptions').value,
		qty : this.myForm.get('qty').value,
		rate : this.myForm.get('rate').value,
		amount : this.myForm.get('amount').value
	}

    this.vc.dismiss(formData);

  }

  close(){
    this.vc.dismiss();
  }
}
