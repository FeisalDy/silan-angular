import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEpubComponent } from './upload-epub.component';

describe('UploadEpubComponent', () => {
  let component: UploadEpubComponent;
  let fixture: ComponentFixture<UploadEpubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadEpubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadEpubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
