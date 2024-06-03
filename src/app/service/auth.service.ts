import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Parent} from '../model/parent';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  readonly currentUserSubject: BehaviorSubject<Parent>;
  currentUser: Observable<Parent>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    console.log(this.currentUserSubject);
  }

  public get currentUserValue(): Parent {
    return this.currentUserSubject.value;
  }

  login(iin: string, password: string): Observable<Parent> {
    return this.http.post(`${environment.url}/login`, { iin, password }, { observe: 'response', responseType: 'text' })
      .pipe(
        map((res: HttpResponse<string>) => {
          if (res.status === 200) {
            const token = res.body || '';
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = payload.roles || [];
            const parent: Parent = { iin, token, roles };
            localStorage.setItem('currentUser', JSON.stringify(parent));
            this.currentUserSubject.next(parent);
            console.log('User: ', parent);

            if (roles.some(role => role.name === 'ROLE_ADMIN')) {
              console.log('User is an admin');
              this.router.navigate(['/admin']);
            } else {
              console.log('User is not an admin');
              this.router.navigate(['/home']);
            }




            return parent;
          } else {
            throw new Error('Login failed');
          }
        }),
        catchError(e => {
          console.log(e);
          return throwError(e);
        })
      );
  }


  register(data: Parent): Observable<Parent> {
    return this.http.post(`${environment.url}/register`, data, { observe: 'response', responseType: 'text' })
      .pipe(
        map((res: HttpResponse<string>) => {
          if (res.status === 200) {
            const token = res.body || '';
            // Создаем объект User с полем token, если нужно
            const parent: Parent = { iin: data.iin, token };
            localStorage.setItem('currentUser', JSON.stringify(parent));
            this.currentUserSubject.next(parent);
            return parent;
          } else {
            throw new Error('Signup failed');
          }
        }),
        catchError(e => {
          console.log(e);
          return throwError(e);
        })
      );
  }

  // tslint:disable-next-line:typedef
  logout() {
    console.log('Logout called'); // Логирование вызова метода
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null as any);
  }
}
