import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  constructor(private http: HttpClient) {}

  public postRatings(ratings: Ratings): Observable<Ratings> {
    return this.http.post<Ratings>(
      environment.apiUrl + '/api/v1/ratings/',
      ratings
    );
  }

  public getRatings(): Observable<Ratings> {
    return this.http.get<Ratings>(environment.apiUrl + '/api/v1/ratings');
  }
}

export interface Ratings {
  score: number;
  comment?: string;
}
