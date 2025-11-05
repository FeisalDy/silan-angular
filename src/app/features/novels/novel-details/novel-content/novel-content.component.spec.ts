import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelContentComponent } from './novel-content.component';

describe('NovelContentComponent', () => {
  let component: NovelContentComponent;
  let fixture: ComponentFixture<NovelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
