import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChapterComponent } from './show-chapter.component';

describe('ShowChapterComponent', () => {
  let component: ShowChapterComponent;
  let fixture: ComponentFixture<ShowChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowChapterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
