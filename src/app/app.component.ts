import { Component } from '@angular/core';
import {FcmService} from "./services/fcm/fcm.service";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
  ];
  // public labels = [];
  constructor(private fcmService: FcmService) {
    this.initializeApp()
  }

  initializeApp() {
    // this.fcmService.initPush()
  }
}
