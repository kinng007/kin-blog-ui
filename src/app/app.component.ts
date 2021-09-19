import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RateUsComponent } from './rate-us/rate-us.component';
import { RateService } from './rate-us/rate.service';
import { switchMap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

const PROJECT_NAME: string = 'Kin Blog';
const PROJECTS_SUFFIX: string = '@projects$';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  projectName: string = '';
  projectSuffix: string = '';

  constructor(
    private rateService: RateService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.info('starting app');
    const handle = setInterval(() => {
      if (this.projectName.length < PROJECT_NAME.length) {
        this.projectName = PROJECT_NAME.substring(
          0,
          this.projectName.length + 1
        );
      } else if (this.projectSuffix.length < PROJECTS_SUFFIX.length) {
        this.projectSuffix = PROJECTS_SUFFIX.substring(
          0,
          this.projectSuffix.length + 1
        );
      } else {
        clearInterval(handle);
      }
    }, 50);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  rateMe(): void {
    this.rateService
      .getRatings()
      .pipe(
        switchMap((r) =>
          this.dialog
            .open(RateUsComponent, {
              width: '850px',
              data: r,
            })
            .afterClosed()
        ),
        filter((r) => !!r),
        switchMap((rating) => this.rateService.postRatings(rating))
      )
      .subscribe();
  }

  shareLink(): void {
    const shareData = {
      title: 'Kin Blog',
      text: 'A simple yet eligent blogging website made by Kinshuk Majee',
      url: 'https://kinblog.mdbgo.io',
    };
    navigator.share(shareData).then(
      () => console.info('Shared sucessfully!'),
      (err) => console.error('something went wrong', err)
    );
  }
}
