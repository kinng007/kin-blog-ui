import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './../login/login.service';
import { switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  public getTasks(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/tasks');
  }

  public getMyBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(environment.apiUrl + '/api/v1/blogs');
  }

  public getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(environment.apiUrl + '/api/v1/blogs/all');
  }

  public createBlog(blog: BlogRequest): Observable<Blog> {
    return this.http.post<Blog>(environment.apiUrl + '/api/v1/blogs', blog);
  }

  public updateBlog(blogId: string, blog: BlogRequest): Observable<Blog> {
    return this.http.put<Blog>(
      environment.apiUrl + '/api/v1/blogs/' + blogId,
      blog
    );
  }

  public getBlog(blogId: string): Observable<Blog> {
    return this.http.get<Blog>(environment.apiUrl + '/api/v1/blogs/' + blogId);
  }
}

export interface Blog extends BlogRequest {
  _id: number;
  title: string;
  author: string;
  subtitle: string;
  content: string;
  createdOn: string;
  lastUpdatedOn: string;
}

export interface BlogRequest {
  title: string;
  subtitle: string;
  content: string;
}
