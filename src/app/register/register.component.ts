import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Parent } from '../model/parent';
import { AuthenticationService } from '../service/auth.service';
import { CityService } from '../service/city.service';
import { City } from '../model/city';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy, OnInit {
  cityAll: City[] = [];
  user: Parent = {
    iin: '',
    name: '',
    f_name: '',
    surname: '',
    cityId: null,
    gender: '',
    phoneNumber: '',
    password: '',
    citizenship: 'KAZAKHSTAN'
  };

  signupForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cityService: CityService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        iin: ['', Validators.required],
        surname: ['', Validators.required],
        name: ['', Validators.required],
        f_name: ['', Validators.required],
        cityId: ['', Validators.required],
        gender: ['', Validators.required],
        phoneNumber: [''],
        password: ['', Validators.required],
        repeat_password: ['', Validators.required],
        citizenship: [{ value: 'KAZAKHSTAN', disabled: true }],
        dateOfBirth: ['', Validators.required]
      },
      {
        validator: this.passwordMatchValidator
      }
    );
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getAllCity();
  }

  // tslint:disable-next-line:typedef
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    // tslint:disable-next-line:variable-name
    const repeat_password = formGroup.get('repeat_password').value;
    return password === repeat_password ? null : { passwordMismatch: true };
  }

  getAllCity(): void {
    this.cityService.getAllCity().subscribe(
      (response: City[]) => {
        this.cityAll = response;
        console.log('Cities: ', this.cityAll);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.signupForm.controls;
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const data: Parent = {
      iin: this.f.iin.value,
      name: this.f.name.value,
      f_name: this.f.f_name.value,
      surname: this.f.surname.value,
      cityId: this.f.cityId.value,
      gender: this.f.gender.value,
      phoneNumber: this.f.phoneNumber.value,
      password: this.f.password.value,
      citizenship: this.f.citizenship.value,
      dateOfBirth: this.f.dateOfBirth.value
    };

    this.loading = true;
    this.authService.register(data).subscribe({
      next: (result) => {
        console.log(result);
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {}
}
