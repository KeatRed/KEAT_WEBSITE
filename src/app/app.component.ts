import { AfterViewInit, Component,ElementRef, Renderer2  } from '@angular/core';
/////// GSAP //////////
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextPlugin } from "gsap/TextPlugin";

/////// GSAP /////////
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
  
})
export class AppComponent implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onIntersectionChange(isIntersecting: boolean) {
    const svgContainer = this.el.nativeElement.querySelector('.svg-container');
    console.log('AppComponent: Intersection change detected:', isIntersecting);
    if (isIntersecting) {
      console.log('SVG is visible, removing minimized class');
      this.renderer.removeClass(svgContainer, 'minimized');
    } else {
      console.log('SVG is not visible, adding minimized class');
      this.renderer.addClass(svgContainer, 'minimized');
    }
    
  }
  ngAfterViewInit(): void {
    gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase);
    console.clear()

  }

  title = 'keat_website';
  
}
