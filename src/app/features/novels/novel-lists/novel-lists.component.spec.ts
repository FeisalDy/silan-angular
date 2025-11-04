import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelListsComponent } from './novel-lists.component';

describe('NovelListsComponent', () => {
  let component: NovelListsComponent;
  let fixture: ComponentFixture<NovelListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovelListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
