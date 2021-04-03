/*
* Adapted from: https://devdactic.com/ionic-jwt-refresh-token/
* */

import { environment } from "../../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins;

const ACCESS_TOKEN_KEY = 'access';
const REFRESH_TOKEN_KEY = 'refresh';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null)
  currentAccessToken = null
  url = environment.api_url

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  // Load accessToken on startup
  async loadToken() {
    const token = await Storage.get({ key: ACCESS_TOKEN_KEY });
    if (token && token.value) {
      this.currentAccessToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  // Get our secret protected data
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.url}/auth/users/me/`);
  }

  // Create new user
  signUp(credentials: any): Observable<any> {
    return this.http.post(`${this.url}/auth/users/`, credentials);
  }


  resetPassword(accountInfo: {email, phone}): Observable<any> {
    return this.http.post(`${this.url}/auth/users/reset_password/`, accountInfo);
  }

  activateAccount(accountInfo: {uid, token}): Observable<any> {
    return this.http.post(`${this.url}/auth/users/activation/`, accountInfo);
  }

  setNewPassword(credentials: {uid, token, new_password, re_new_password}): Observable<any> {
    return this.http.post(`${this.url}/auth/users/reset_password_confirm/`, credentials);
  }

  // Sign in a user and store access and refresh token
  login(credentials: {phone, password}): Observable<any> {
    return this.http.post(`${this.url}/auth/jwt/create/`, credentials).pipe(
      switchMap((tokens: {access, refresh }) => {
        return this.storeAccessTokens(tokens)
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  // remove all local tokens and navigate to login
  logout() {
    this.currentAccessToken = null;
    // Remove all stored tokens
    const deleteAccess = Storage.remove({ key: ACCESS_TOKEN_KEY });
    const deleteRefresh = Storage.remove({ key: REFRESH_TOKEN_KEY });
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/', { replaceUrl: true });
    return from(Promise.all([deleteAccess, deleteRefresh]));
  }

  // Load the refresh token from storage then attach it as the header for one specific API call
  getNewAccessToken() {
    const refreshToken = from(Storage.get({ key: REFRESH_TOKEN_KEY }));
    return refreshToken.pipe(
      switchMap(token => {
        if (token && token.value) {
          return this.http.post(`${this.url}/auth/jwt/refresh/`, {refresh: token.value});
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }

  // Store a new access token
  storeAccessTokens(tokens) {
    this.currentAccessToken = tokens.access;
    const storeAccess = Storage.set({key: ACCESS_TOKEN_KEY, value: tokens.access});
    const storeRefresh = Storage.set({key: REFRESH_TOKEN_KEY, value: tokens.refresh});
    return from(Promise.all([storeAccess, storeRefresh]));
  }
}
