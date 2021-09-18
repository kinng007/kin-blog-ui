import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { GoogleAuthUser } from '../login.service';
import { LoginService } from './../login.service';
import { defaultIfEmpty, filter, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserService } from './../../user/user.service';

const LOGGED_IN = 'LOGGED_IN';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authIsLoaded: boolean = false;
  loggedIn: boolean = false;
  loggedUser: User = undefined;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private element: ElementRef,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginService
      .loadAuth2()
      .pipe(
        tap((_) => {
          const self = this;
          this.loginService.isLoaded$.subscribe((l) => (self.authIsLoaded = l));
          this.loginService.isLoggedIn$.subscribe(
            (loggedIn) => (self.loggedIn = loggedIn)
          );
          this.userService
            .getCurrentUser()
            .pipe(
              tap((u) => {
                if (!self.loggedUser && !!u) {
                  self._snackBar.open('Signed in as ' + u.displayName, 'Ok!', {
                    duration: 2000,
                  });
                } else if (!!self.loggedUser && !u) {
                  self._snackBar.open('Successfully sign off', 'Thanks', {
                    duration: 2000,
                  });
                }
              }),
              tap((u) => (this.loggedUser = u))
            )
            .subscribe(
              (_) => console.info('User Loaded'),
              (err) => console.error(err)
            );
        }),
        switchMap((_) =>
          this.loginService.isSignedIn().pipe(
            filter((isSignedIn) => isSignedIn.valueOf()),
            switchMap((_) => this.loginService.getSignedInUser()),
            defaultIfEmpty({})
          )
        )
      )
      .subscribe();
  }

  signIn(): void {
    this.loginService.signIn().subscribe();
  }

  signOut(): void {
    this.loginService.signOut().subscribe();
  }
}
