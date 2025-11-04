import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelCardComponent } from './novel-card.component';

describe('NovelCardComponent', () => {
  let component: NovelCardComponent;
  let fixture: ComponentFixture<NovelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
