import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { LoginService } from './../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly cache: Map<string, Observable<User>> = new Map<
    string,
    Observable<User>
  >();

  constructor(private http: HttpClient, private loginService: LoginService) {}

  public createOrUpdate(user: User, token?: string): Observable<User> {
    if (!this.cache[user.userName]) {
      return (this.cache[user.userName] = this.http
        .post<User>(
          environment.apiUrl + '/api/v1/users',
          user,
          token && { headers: { Authorization: 'gauth=' + token } }
        )
        .pipe(shareReplay(1)));
    }
    return this.cache[user.userName];
  }

  public getUser(userId: string): Observable<User> {
    if (!this.cache[userId]) {
      this.cache[userId] = this.http
        .get<User>(environment.apiUrl + '/api/v1/users/' + userId)
        .pipe(shareReplay(1));
    }
    return this.cache[userId];
  }

  public getCurrentUser(): Observable<User> {
    return this.loginService.user$.pipe(
      switchMap((u) => {
        if (!!u) {
          return this.createOrUpdate(
            {
              displayName: u.name,
              pictureUrl: u.imageUrl,
              userName: u.email,
            },
            u.token
          );
        } else {
          return of<User>(undefined);
        }
      })
    );
  }
}

export interface User {
  _id?: string;
  displayName: string;
  userName: string;
  introduction?: string;
  pictureUrl: string;
}
