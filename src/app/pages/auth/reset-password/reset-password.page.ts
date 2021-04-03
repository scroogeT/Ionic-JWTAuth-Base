import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  passwordResetForm: FormGroup

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
              private loadingController: LoadingController, private alertController: AlertController) { }

  ngOnInit() {
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', ],
    })
  }

  async requestPasswordReset() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.resetPassword(this.passwordResetForm.value).subscribe(
      async res => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Password Reset Successful !',
          message: 'Your password has been reset successfully, ' +
            'please click the link sent to your email to set a new password.',
          buttons: ['OK'],
        });
        await alert.present();
      await this.router.navigate(['login'])
    }, async err => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Signup failed',
          message: err.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    )
  }

}
