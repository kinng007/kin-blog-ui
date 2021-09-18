import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogUpsertComponent } from './blog-upsert.component';

describe('BlogUpsertComponent', () => {
  let component: BlogUpsertComponent;
  let fixture: ComponentFixture<BlogUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogUpsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
