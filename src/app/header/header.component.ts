import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../service/auth.service';
import {Parent} from '../model/parent';
import {ParentService} from '../service/parent.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  currentUser: Parent;
  parentCurrent: Parent;
  constructor(private router: Router, private authService: AuthenticationService, private parentService: ParentService) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.getParentByIin(this.currentUser.iin);
  }

  public getParentByIin(iin: string): void {
    this.parentService.getByUsername(iin).subscribe(
      (response: Parent) => {
        this.parentCurrent = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  // tslint:disable-next-line:typedef
  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
  // tslint:disable-next-line:typedef
  logout() {
    this.authService.logout();
  }
}
