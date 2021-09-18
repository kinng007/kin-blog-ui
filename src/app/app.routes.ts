import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BlogContainerComponent } from './blog/blog-container/blog-container.component';
import { ReadBlogComponent } from './blog/blog-container/read-blog/read-blog.component';
import { BlogUpsertComponent } from './blog/blog-container/blog-upsert/blog-upsert.component';

export const appRoutes: Routes = [
  { path: 'blogs', component: BlogContainerComponent },
  { path: 'blogs/new', component: BlogUpsertComponent },
  { path: 'blogs/:blogId', component: ReadBlogComponent },
  { path: 'blogs/:blogId/edit', component: BlogUpsertComponent },
  { path: '', pathMatch: 'full', redirectTo: '/blogs' },
  { path: '**', component: PageNotFoundComponent },
];
