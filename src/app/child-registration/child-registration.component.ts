import { Component, OnInit } from '@angular/core';
import {ChildService} from '../service/child.service';
import {Child} from '../model/child';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../service/auth.service';
import {Parent} from '../model/parent';
import {Router} from '@angular/router';
import {ParentService} from '../service/parent.service';

@Component({
  selector: 'app-child-registration',
  templateUrl: './child-registration.component.html',
  styleUrls: ['./child-registration.component.scss']
})
export class ChildRegistrationComponent implements OnInit {
  sideBarOpen = true;
  childAll: Child[];
  currentUser: Parent;
  parentCurrent: Parent;
  childForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private childService: ChildService,
    private authService: AuthenticationService,
    private parentService: ParentService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    if (this.currentUser && this.currentUser.iin) {
      this.getParentByIin(this.currentUser.iin);
    }

    this.childForm = this.formBuilder.group({
      iin: ['', Validators.required],
      surname: ['', Validators.required],
      name: ['', Validators.required],
      f_name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      parentId: [{value: '', disabled: true}]  // Инициализация пустым значением
    });
  }

  public getParentByIin(iin: string): void {
    this.parentService.getByUsername(iin).subscribe(
      (response: Parent) => {
        this.parentCurrent = response;
        console.log('parentCurrent: ', this.parentCurrent);
        this.childForm.patchValue({ parentId: this.parentCurrent.id });  // Установка parentId в форму
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.childForm.controls;
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;
    if (this.childForm.invalid) {
      return;
    }
    const data: Child = {
      iin: this.f.iin.value,
      name: this.f.name.value,
      f_name: this.f.f_name.value,
      surname: this.f.surname.value,
      dateOfBirth: this.f.dateOfBirth.value,
      parentId: this.parentCurrent.id  // Использование parentCurrent.id
    };
    console.log('parent id', data.parentId);
    this.childService.addChild(data).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
}
