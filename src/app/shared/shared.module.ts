// Dans shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextDistortionComponent } from './components/text-distortion/text-distortion.component';
import { SvgKeatonComponent } from './components/svg-keaton/svg-keaton.component';

@NgModule({
  declarations: [
    TextDistortionComponent,
    SvgKeatonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TextDistortionComponent,
    SvgKeatonComponent
  ]
})
export class SharedModule {}
