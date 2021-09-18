import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogContainerComponent } from './blog-container/blog-container.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LoginModule } from './../login/login.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadBlogComponent } from './blog-container/read-blog/read-blog.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogUpsertComponent } from './blog-container/blog-upsert/blog-upsert.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorJsComponent } from './blog-container/blog-upsert/content-editor/content-editor.component';
@NgModule({
  declarations: [
    BlogContainerComponent,
    ReadBlogComponent,
    BlogUpsertComponent,
    EditorJsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    LoginModule,
    MatInputModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  exports: [BlogContainerComponent],
})
export class BlogModule {}
