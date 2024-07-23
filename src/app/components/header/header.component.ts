import { AfterViewInit, Component,ViewEncapsulation } from '@angular/core';
import { gsap } from "gsap";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements AfterViewInit{

  constructor() { }
  ngAfterViewInit(): void {
    const items = document.querySelectorAll("#menu li") as NodeListOf<HTMLLIElement>;

    gsap.defaults({ duration: 0.1 });

    items.forEach((item: HTMLLIElement, index: number) => {
    const button = item.querySelector("button") as HTMLButtonElement;

    // Crée une timeline GSAP pour chaque élément `li`
    const tl = gsap.timeline({ paused: true })
      .to(button, { color: "black", scale: 1.2, transformOrigin: "center" })
      .to(button, { backgroundColor: 'rgb(219,219,219)',color:"black", scale: 1.3 }, "<");

    // Ajoute des écouteurs d'événements pour jouer et inverser l'animation
    item.addEventListener("mouseenter", () => tl.play());
    item.addEventListener("mouseleave", () => tl.reverse());
    });
    
  }
  

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

  
}
