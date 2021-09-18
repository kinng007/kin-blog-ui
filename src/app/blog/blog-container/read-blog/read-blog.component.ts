import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog, BlogService } from '../../blog.service';
import EditorJS from '@editorjs/editorjs';
import { User, UserService } from './../../../user/user.service';
import { tap, switchMap, filter } from 'rxjs/operators';
import blogTools from '../blog-tools';
import { LoginService } from './../../../login/login.service';

@Component({
  selector: 'app-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
})
export class ReadBlogComponent implements AfterViewInit {
  loading: boolean = false;
  blogId: string;
  blog: Blog;
  editor: EditorJS;
  author: User;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private userService: UserService,
    private loginService: LoginService
  ) {}

  ngAfterViewInit(): void {
    this.loading = true;
    this.route.params.subscribe((p) => {
      this.blogId = p['blogId'];
      this.blogService
        .getBlog(this.blogId)
        .pipe(
          tap((b) => (this.blog = b)),
          switchMap((blog) => this.userService.getUser(blog.author)),
          tap((user) => (this.author = user))
        )
        .subscribe((_) => {
          this.loading = false;
          this.editor = new EditorJS({
            holder: 'read-blog',
            tools: blogTools,
            data: {
              blocks: JSON.parse(this.blog.content),
            },
            readOnly: true,
          });
        });
    });

    this.userService.getCurrentUser().subscribe(
      (u) => {
        this.currentUser = u;
      },
      (err) => console.error(err)
    );
  }

  editBlog() {
    this.router.navigate(['/blogs/' + this.blog._id + '/edit']);
  }
}
