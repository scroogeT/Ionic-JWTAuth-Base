import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  secretData = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async getData() {
    this.secretData = null;

    this.authService.getUserInfo().subscribe((res: { full_name, email, phone }) => {
      this.secretData = res;
    });
  }

  logout() {
    this.authService.logout();
  }

}
