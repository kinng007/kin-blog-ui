import { Component, OnInit } from '@angular/core';
import { Blog, BlogService, BlogRequest } from './../blog.service';
import { tap, switchMap, mergeMap, filter, last } from 'rxjs/operators';
import EditorJS from '@editorjs/editorjs';
import { User, UserService } from 'src/app/user/user.service';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './../../login/login.service';

@Component({
  selector: 'app-blog-container',
  templateUrl: './blog-container.component.html',
  styleUrls: ['./blog-container.component.scss'],
})
export class BlogContainerComponent implements OnInit {
  blogs: Blog[];
  newBlog: BlogRequest;
  editor: EditorJS;
  title: string;
  subtitle: string;
  users: { [key: string]: User } = {};
  currentUser: User;
  loading: boolean = false;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService.getCurrentUser().subscribe(
      (u) => {
        this.currentUser = u;
      },
      (err) => console.error(err)
    );

    this.blogService
      .getBlogs()
      .pipe(
        tap((blogs) => (this.blogs = blogs)),
        switchMap((blogs) => from(blogs)),
        mergeMap((blog) => this.userService.getUser(blog.author)),
        tap(
          (user) => (this.users[user._id] = this.users[user.userName] = user)
        ),
        last()
      )
      .subscribe(
        (t) => {
          this.loading = false;
          console.info('Blogs loaded: ' + this.blogs.length);
        },
        (err) => console.error(err)
      );
  }

  openBlog(blog: Blog): void {
    this.router.navigate(['/blogs/' + blog._id]);
  }

  editBlog(blog: Blog): void {
    this.router.navigate(['/blogs/' + blog._id + '/edit']);
  }

  createBlog(): void {
    this.router.navigate(['/blogs/new']);
  }
}
