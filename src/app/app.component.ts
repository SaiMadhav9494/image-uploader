import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Item } from './item.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('photo', { static: true }) photo;
  items: Array<Item> = [];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [''],
      description: [''],
      quantity: [null],
    });
  }

  get inputForm() {
    return this.form.controls;
  }

  onSubmit() {

    const item: Item = {
      title: this.inputForm.title.value,
      description: this.inputForm.description.value,
      quantity: this.inputForm.quantity.value,
      photo: null
    };

    if(this.photo.nativeElement.files && this.photo.nativeElement.files[0]) {
      let fileToUpload = this.photo.nativeElement.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);

      reader.onload = (file) => {
        item.photo = reader.result;
        this.items.push(item);
      }
    } else {
      this.items.push(item);
    }
  }
}
