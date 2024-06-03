import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, RouterLinkWithHref, RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '../service/auth.service';




@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | undefined;
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      iin: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    // if a user enters /admin-home but needs login, they get redirected
    // to /admin-home after authentication, or if they didn't give any link,
    // they get redirected to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get f() {
    return this.loginForm.controls; }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    // @ts-ignore
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['iin'].value, this.f['password'].value)
      .subscribe(
        data => {
          this.loading = false;
          console.log('tekseris: ', data.roles);
          const isAdmin = data.roles.some(role => role.name === 'ROLE_ADMIN');
          if (isAdmin) {
            console.log('KORIP TURMYN');
            console.log('role: ', data.roles[0].name);
            this.router.navigate(['/admin']);
          } else {
            // console.log('role: ', data.roles[0].name);
            console.log('KORIP TURMYN userrr');
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          console.log(error); // check if the error was returned
          this.loading = false;
          this.error = 'Login failed';
        }
      );
  }


  // tslint:disable-next-line:typedef
  signInWithKey() {
  }
}
