import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {IonIntlTelInputValidators} from "ion-intl-tel-input";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  // formValue = {phone: '', password: ''};
  preferredCountries = ['ng', 'za']

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
              private alertController: AlertController, private router: Router,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, IonIntlTelInputValidators.phone]),
      password: new FormControl(null, [Validators.required, Validators.min(5)]),
    })
    //   this.formBuilder.group({
    //   phone: ['', Validators.required, IonIntlTelInputValidators.phone],
    //   password: ['', Validators.required]
    // })
  }

  get phone() {return this.loginForm.get('phone')}

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    let credentials = {phone: this.loginForm.value.phone.internationalNumber, password: this.loginForm.value.password}
    this.authService.login(credentials)
      .subscribe(
      async _ => {
        await loading.dismiss();
        await this.router.navigateByUrl('/home', {replaceUrl: true});
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.detail,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

}
