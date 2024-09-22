import { Directive, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements AfterViewInit, OnDestroy {
  @Output() isIntersecting = new EventEmitter<boolean>();
  private observer!: IntersectionObserver;

  constructor(private element: ElementRef) {}


  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        console.log('Entry observed:', entry.target); // Affiche l'élément observé
        console.log('Is intersecting:', entry.isIntersecting); // Affiche le statut d'intersection
        if (entry.target.tagName.toLowerCase() !== 'app-header') {
          this.isIntersecting.emit(entry.isIntersecting);
        }
      });
    });
  
    this.observer.observe(this.element.nativeElement);
  }
  

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
