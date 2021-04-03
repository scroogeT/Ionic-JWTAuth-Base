import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styleUrls: ['./activate-account.page.scss'],
})
export class ActivateAccountPage implements OnInit {

  constructor(private authService: AuthService, private router: Router,
              private route: ActivatedRoute, private loadingController: LoadingController,
              private alertController: AlertController) { }

  async ngOnInit() {
    await this.route.params.subscribe(params => {
      this.activateAccount({uid: params.uid, token: params.token}).then(res => {
        this.router.navigate(['login'])
      })
    });
  }

  async activateAccount(accountInfo: {uid, token}){
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.activateAccount(accountInfo).subscribe(
      async res => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Account Activated',
          message: 'Your new password has been activated. You may now login !',
          buttons: ['OK'],
        });
        await alert.present();
    },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Account Activation Failed',
          message: err.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    )
  }

}
