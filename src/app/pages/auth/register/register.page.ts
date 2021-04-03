import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {IonIntlTelInputValidators} from "ion-intl-tel-input";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registrationForm: FormGroup
  //formValue = {phone: '', full_name: '', email: '', password: '', re_password: ''}
  preferredCountries = ['ng', 'za']

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
              private alertController: AlertController, private router: Router,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, IonIntlTelInputValidators.phone]),
      full_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.min(7)]),
      re_password: new FormControl(null, [Validators.required, Validators.min(7)]),
    })
  }

  get phone() {return this.registrationForm.get('phone')}

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signUp(this.registrationForm.value).subscribe(
      async _ => {
        await loading.dismiss();
        // this.login();
        await this.router.navigate(['login'])
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Signup failed',
          message: res.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

}
