import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from './item.model';
import { ServerResponse } from './serverresponse.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import {  HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: Array<Item> = [];
  form: FormGroup;
  serverAddress = 'https://beeble-assignment.herokuapp.com';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [''],
      description: [''],
      quantity: [null],
      photo: [null]
    });

    this.http.get<ServerResponse>(`${ this.serverAddress }/items`).pipe(catchError(this.handleError), shareReplay())
    .subscribe((response: ServerResponse) => {
      console.log(response);
      this.items = response.data;
    }, error => {
      console.log(error);
      alert('Something has gone wrong');
    });
  }

  get inputForm() {
    return this.form.controls;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      this.form.get('photo').setValue(file);
    }
  }

  onSubmit() {
    console.log(this.inputForm);
    console.log(this.form);
    const item: Item = {
      title: this.inputForm.title.value,
      description: this.inputForm.description.value,
      quantity: this.inputForm.quantity.value,
      photo: null
    };

      let fileToUpload = this.form.get('photo').value;
      if(fileToUpload) {
        const reader = new FileReader();
        reader.readAsDataURL(fileToUpload);

        reader.onload = (file) => {
          item.photo = reader.result;
          this.items.push(item);

          const formData: FormData = new FormData();
          Object.entries(this.form.value).forEach(([key, value]: any[]) => {
            formData.set(key, value);
          });
          this.addItem(formData).subscribe((response: ServerResponse) => {
            console.log('Item added successfully');
          }, error => {
            alert('Something has gone wrong');
          });
        }
      } else {
        this.items.push(item);
        this.addItem(item).subscribe((response: ServerResponse) => {
          console.log('Item added successfully');
        }, error => {
          alert('Something has gone wrong');
        });
      }
  }

  addItem(item) {
    return this.http.post<ServerResponse>(`${ this.serverAddress }/items`, item).pipe(catchError(this.handleError), shareReplay());
  }

  // Error handler for the http requests.
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError({
        error: 'client_side_error',
        data: null,
      });
    } else if (error.error instanceof ProgressEvent) {
      return throwError(
        { error: 'client_or_server_failure', data: null });
    } else {
      return throwError(error.error);
    }
  }
}
