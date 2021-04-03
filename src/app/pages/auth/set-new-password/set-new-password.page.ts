import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.page.html',
  styleUrls: ['./set-new-password.page.scss'],
})
export class SetNewPasswordPage implements OnInit {

  setNewPasswordForm: FormGroup

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
              private route: ActivatedRoute, private loadingController: LoadingController,
              private alertController: AlertController) {
    this.setNewPasswordForm = this.formBuilder.group({
      new_password: ['', [Validators.required]],
      re_new_password: ['', [Validators.required]],
      uid: ['', [Validators.required]],
      token: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.setNewPasswordForm.controls['uid'].setValue(params.uid)
      this.setNewPasswordForm.controls['token'].setValue(params.token)
      console.log('The uid of this route is: ', params.uid);
      console.log('The token of this route is: ', params.token);
    });
  }

  async confirmNewPassword(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.setNewPassword(this.setNewPasswordForm.value).subscribe(
      async res => {
        //  this.authService.showAlert('New Password Set', 'Your new password has been set. You may now login !')
        await this.router.navigate(['login'])
    },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Password Reset failed',
          message: err.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    )
  }

}
