import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginModule } from './login/login.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlogModule } from './blog/blog.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { UserModule } from './user/user.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleAuthInterceptor } from './google.auth.interceptor';
import {
  RateUsComponent,
  StarRatingComponent,
} from './rate-us/rate-us.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [AppComponent, RateUsComponent, StarRatingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LoginModule,
    MatTooltipModule,
    BlogModule,
    RouterModule.forRoot(appRoutes),
    UserModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GoogleAuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
