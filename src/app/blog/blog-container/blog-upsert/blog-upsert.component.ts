import { Component, AfterViewInit } from '@angular/core';
import { BlogService } from '../../blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogRequest } from './../../blog.service';
import { OutputBlockData } from '@editorjs/editorjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  filter,
  switchMap,
  defaultIfEmpty,
  map,
  tap,
  first,
} from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  templateUrl: './blog-upsert.component.html',
  styleUrls: ['./blog-upsert.component.scss'],
})
export class BlogUpsertComponent implements AfterViewInit {
  blogRequest: BlogRequest = {
    title: '',
    subtitle: '',
    content: '[]',
  };
  title: string = '';
  subtitle: string = '';
  loading: boolean = false;
  blogId?: string;
  blocks: OutputBlockData[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(
        first(),
        filter((p) => !!p['blogId']),
        tap((_) => (this.loading = true)),
        map((p) => (this.blogId = p['blogId'])),
        switchMap((_) => this.blogService.getBlog(this.blogId)),
        tap((_) => (this.loading = false)),
        defaultIfEmpty({
          title: '',
          subtitle: '',
          content: '[]',
        } as BlogRequest)
      )
      .subscribe((b) => {
        this.blogRequest = b;
        this.title = b.title;
        this.subtitle = b.subtitle;
        this.blocks = JSON.parse(this.blogRequest.content);
      });
  }

  isBlogValid(): boolean {
    return (
      !!this.title && !!this.subtitle && !!this.blocks && this.blocks.length > 0
    );
  }

  saveBlog(): void {
    this.loading = true;
    this.blogRequest.title = this.title;
    this.blogRequest.subtitle = this.subtitle;
    this.blogRequest.content = JSON.stringify(this.blocks);

    const upsertRequest = !!this.blogId
      ? this.blogService.updateBlog(this.blogId, this.blogRequest)
      : this.blogService.createBlog(this.blogRequest);

    upsertRequest.subscribe(
      (t) => {
        console.info(t);
        this.loading = false;

        this._snackBar.open(
          !!this.blogId ? 'Blog Updated' : 'Blog Created',
          '',
          {
            duration: 2000,
          }
        );
        this.backHome();
      },
      (err) => console.error(err)
    );
  }

  backHome(): void {
    this.router.navigate(['/blogs']);
  }
}
