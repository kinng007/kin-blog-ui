import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private clientId: string =
    '388156662436-qnjt3v61hmuh6hvomne3s1rjvgu70bqf.apps.googleusercontent.com';

  private scope = ['profile', 'email'].join(' ');

  public auth2: GoogleAuth;
  public user$: BehaviorSubject<GoogleAuthUser> =
    new BehaviorSubject<GoogleAuthUser>(null);
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private zone: NgZone) {}

  public loadAuth2(): Observable<gapi.auth2.GoogleAuth> {
    return new Observable((s) => {
      gapi.load('auth2', {
        callback: () =>
          gapi.auth2
            .init({
              client_id: this.clientId,
              cookie_policy: 'single_host_origin',
              scope: this.scope,
            })
            .then(
              (auth) => {
                this.zone.run(() => {
                  this.auth2 = auth;
                  this.isLoaded$.next(true);
                });
                s.next(auth);
                s.complete();
              },
              (err) => {
                console.error(err);
                s.error(err);
              }
            ),
        onerror: (err) => s.error(err),
      });
    });
  }

  setUser() {
    this.zone.run(() => {
      const googleUser = this.auth2.currentUser.get();
      const user: GoogleAuthUser = {
        id: googleUser.getId(),
        name: googleUser.getBasicProfile().getName(),
        email: googleUser.getBasicProfile().getEmail(),
        imageUrl: googleUser.getBasicProfile().getImageUrl(),
        givenName: googleUser.getBasicProfile().getGivenName(),
        familyName: googleUser.getBasicProfile().getFamilyName(),
        token: googleUser.getAuthResponse().id_token,
      };
      this.user$.next(user);
      this.isLoggedIn$.next(true);
    });
  }

  signIn(): Observable<GoogleUser> {
    return new Observable((s) => {
      this.auth2.signIn().then(
        (user) => {
          console.info('Signed In');
          s.next(user);
          s.complete();
          this.setUser();
        },
        (err) => {
          console.error(err);
          s.error(err);
        }
      );
    });
  }

  isSignedIn(): Observable<Boolean> {
    return new Observable((s) => {
      const signedIn = this.auth2.isSignedIn.get();
      s.next(signedIn);
      s.complete();
    });
  }

  getSignedInUser(): Observable<GoogleUser> {
    return new Observable((s) => {
      s.next(this.auth2.currentUser.get());
      this.setUser();
      s.complete();
    });
  }

  signOut(): Observable<void> {
    return new Observable((s) => {
      this.auth2.signOut().then(
        () => {
          this.zone.run(() => {
            this.isLoggedIn$.next(false);
            this.user$.next(null);
          });
          s.next();
          s.complete();
        },
        (err) => {
          console.error(err);
          s.error(err);
        }
      );
    });
  }
}

export interface GoogleAuthUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  givenName: string;
  familyName: string;
  token: string;
}
