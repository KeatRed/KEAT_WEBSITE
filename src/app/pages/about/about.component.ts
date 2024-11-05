import { Component,ViewEncapsulation, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements AfterViewInit{
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Ajout de la classe "visible" pour déclencher le fondu
    setTimeout(() => {
      const subtitle = this.el.nativeElement.querySelector('#subtitle');
      this.renderer.addClass(subtitle, 'visible');
    }, 500); // Délai avant de lancer l'animation
    setTimeout(() => {
      const message = this.el.nativeElement.querySelector('#welcome-message');
      this.renderer.addClass(message, 'visible');
    }, 1000); // Délai avant de lancer l'animation
  }
}
