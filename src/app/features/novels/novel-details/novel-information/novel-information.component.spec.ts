import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelInformationComponent } from './novel-information.component';

describe('NovelInformationComponent', () => {
  let component: NovelInformationComponent;
  let fixture: ComponentFixture<NovelInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovelInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
