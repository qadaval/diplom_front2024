import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  isAdmin = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.isAdmin = currentUser && currentUser.roles.some(role => role.name === 'ROLE_ADMIN');
  }

}
