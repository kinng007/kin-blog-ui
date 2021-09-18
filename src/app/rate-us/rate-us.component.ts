import { ThisReceiver } from '@angular/compiler';
import {
  Component,
  Inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ratings } from './rate.service';

@Component({
  selector: 'app-rate-us',
  template: `
    <div class="rate-us-body">
      <app-star-rating
        [rating]="data.score"
        (ratingUpdated)="onRatingChanged($event)"
      ></app-star-rating>
      <mat-form-field appearance="outline">
        <mat-label>Feedback</mat-label>
        <input
          matInput
          placeholder="Your feedback here..."
          [(ngModel)]="data.comment"
        />
        <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
        <mat-hint>Help me improve with your feedback</mat-hint>
      </mat-form-field>
      <div class="actions">
        <button mat-raised-button (click)="postRatings()" color="primary">
          Save Rating!
        </button>
        <button mat-raised-button (click)="cancel()" color="accent">
          Cancel
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./rate-us.component.scss'],
})
export class RateUsComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<RateUsComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Ratings
  ) {}

  ngAfterViewInit(): void {
    this.data = {
      score: this.data?.score || 3,
      comment: this.data?.comment || '',
    } as Ratings;
  }

  onRatingChanged(event: number): void {
    this.data.score = event;
  }

  postRatings() {
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-star-rating',
  template: `
    <button
      mat-icon-button
      *ngFor="let ratingId of ratingArr; index as i"
      [id]="'star_' + i"
      (click)="onClick(i + 1)"
      [color]="color"
      [matTooltip]="ratingId + 1"
      matTooltipPosition="above"
    >
      <mat-icon>
        {{ showIcon(i) }}
      </mat-icon>
    </button>
    <mat-error *ngIf="starCount == null || starCount == 0">
      Star count is <strong>required</strong> and cannot be zero
    </mat-error>
    <p class="body-2">
      Your rated <span class="body-2">{{ rating }}</span> /
      <span class="body-2">{{ starCount }}</span>
    </p>
  `,
  styleUrls: ['./rate-us.component.scss'],
})
export class StarRatingComponent implements OnInit {
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Output() private ratingUpdated: EventEmitter<number> =
    new EventEmitter<number>();

  ratingArr = [];

  constructor() {}

  ngOnInit() {
    console.log('a ' + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number) {
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
