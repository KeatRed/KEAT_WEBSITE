import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextDistortionComponent } from './text-distortion.component';

describe('TextDistortionComponent', () => {
  let component: TextDistortionComponent;
  let fixture: ComponentFixture<TextDistortionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextDistortionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextDistortionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
