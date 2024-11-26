import { AfterViewInit, Component,ElementRef, Renderer2, HostListener  } from '@angular/core';
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
  private resizeTimer: any;
  isLargeScreen = false;
  isSmallScreen = false;
  private largeScreenQuery: MediaQueryList;
  private mobileScreenQuery: MediaQueryList;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.largeScreenQuery = window.matchMedia('(min-width: 2500px)');
    this.mobileScreenQuery = window.matchMedia('(max-width: 768px)');
  }
  calculateAngle(): number {
    const minAngle = 50;   // Angle minimum
    const maxAngle = 65;   // Angle maximum
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    // Calcul du ratio d'aspect (largeur / hauteur) de l'écran
    const aspectRatio = screenWidth / screenHeight;
    let angle;
  
    // Utilisation de différentes valeurs d'angle en fonction de catégories de ratio d'aspect
    if (aspectRatio >= 2) {
      // Écrans très larges (ultrawide, 21:9, etc.)
      angle = minAngle;
    } else if (aspectRatio > 1 && aspectRatio < 2) {
      // Écrans standard en mode paysage (ex. MacBook Pro 13 pouces)
      angle = minAngle + ((maxAngle - minAngle) * (2 - aspectRatio) / 2); // interpolation progressive
    } else {
      // Écrans en mode portrait (aspect ratio < 1)
      angle = maxAngle;
    }
  
    console.log('Aspect Ratio:', aspectRatio, 'Angle:', angle);
    return angle;
  }
  
  
  calculateRotationVariance(): number {
    const minRotation = 155;    // Rotation minimale pour les écrans larges
    const maxRotation = 183;    // Rotation maximale pour les écrans hauts (mode portrait)
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    // Calcul du ratio d'aspect (largeur / hauteur) de l'écran
    const aspectRatio = screenWidth / screenHeight;
    let rotation;
  
    // Utilisation de différentes valeurs de rotation en fonction de catégories de ratio d'aspect
    if (aspectRatio >= 2) {
      // Écrans très larges (ultrawide, 21:9, etc.)
      rotation = minRotation;
    } else if (aspectRatio > 1 && aspectRatio < 2) {
      // Écrans standard en mode paysage (16:9, 4:3, etc.)
      rotation = minRotation + ((maxRotation - minRotation) * (2 - aspectRatio) / 2); // interpolation entre minRotation et maxRotation
    } else {
      // Écrans en mode portrait (aspect ratio < 1)
      rotation = maxRotation;
    }
  
    console.log('Aspect Ratio:', aspectRatio, 'Rotation:', rotation);
    return rotation;
  }
  

  
  
  
  
  
  // Fonction pour ajuster la taille du placeholder en fonction de la hauteur de .svg-container
  adjustPlaceholderSize() {


    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        console.log('Sur mobile : aucune modification du placeholder.');
        return; // Ne rien faire sur mobile
    }
    const placeholder = this.el.nativeElement.querySelector('.title-placeholder');
    const svgContainer = this.el.nativeElement.querySelector('.svg-container');

    if (svgContainer) {
      const svgHeight = svgContainer.getBoundingClientRect().height; // Récupère la hauteur de .svg-container
      if (this.isLargeScreen){
      // Ajuste la hauteur du placeholder à la hauteur du SVG et du svg minimized
      placeholder.style.height = svgHeight+'px' ; 
      console.log("placeholder.style.height = `80vh`");
      console.log("taille du svg: " + svgHeight + "  devrait etre grand")
      svgContainer.style.left = `0`;
      svgContainer.style.top = `0`;
      //svgContainer.style.height = '200px';
      //svgContainer.style.transform = `scale(0.80)`;
      }else if (this.isSmallScreen){
        placeholder.style.height = svgHeight+'px' ; 
        console.log("placeholder.style.height = `46vh`");
        console.log("taille du svg: " + svgHeight + "  devrait etre petit")
        svgContainer.style.left = `0`;
        svgContainer.style.top = '0';
      }else{
        placeholder.style.height = svgHeight+'px';
        console.log("placeholder.style.height = `100vh`");
        console.log("taille du svg: " + svgHeight + "  devrait etre medium")
        svgContainer.style.left = `0`;
        svgContainer.style.top = `0`;
        
      }
      
    }
  }

  onIntersectionChange(isIntersecting: boolean) {
    const svgContainer = this.el.nativeElement.querySelector('.svg-container');
    const placeholder = this.el.nativeElement.querySelector('.title-placeholder');

    // Vérifier si on est sur mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        console.log('Sur mobile : désactivation du comportement minimized');
        // Ne pas appliquer le comportement minimized sur mobile
        return;
    }


    console.log('AppComponent: Intersection change detected:', isIntersecting);

    if (isIntersecting) {
      console.log('SVG is visible, removing minimized class');
      placeholder.style.height = '0px'; // Réduire la taille à 0 quand visible
      this.renderer.removeClass(svgContainer, 'minimized');
    } else {
      console.log('SVG is not visible, adding minimized class');
      this.adjustPlaceholderSize(); // Ajuster dynamiquement la taille en fonction du .svg-container
      this.renderer.addClass(svgContainer, 'minimized');  
    }
  }
    // Create falling star animation
    createFallingStar(element: HTMLElement, span: HTMLElement, angle: number): void {
      const randomDuration = gsap.utils.random(0, 0.9); // Duration between 2 and 5 seconds
      const randomDelay = gsap.utils.random(0, 10); // Random delay before the star
      const repeatDelay = gsap.utils.random(5, 10); // Délai entre les répétitions
      // Randomly pick whether the star starts from the right or bottom side
      let startX: number, startY: number, endX: number, endY: number;
  
      // Stars start off-screen from the right or bottom and move to the visible area
      if (Math.random() > 0.5) {
        // Start from the right side
        startX = gsap.utils.random(100, 110); // Off-screen to the right
        startY = gsap.utils.random(0, 100); // Anywhere vertically
        endX = startX - 120; // Move to the left
        endY = startY - (120 * Math.tan(angle * (Math.PI / 180))); // Calculate vertical movement based on angle
      
      } else {
        // Start from the bottom side
        startX = gsap.utils.random(0, 100); // Anywhere horizontally
        startY = gsap.utils.random(100, 110); // Off-screen to the bottom
        endX = startX - (120 / Math.tan(angle * (Math.PI / 180))); // Calculate horizontal movement based on angle
        endY = startY - 120; // Move up
      }
  
      // Set initial star position and opacity
      gsap.set(element, {
        x: `${startX}vw`,
        y: `${startY}vh`,
        opacity: 0.5,
        scale: gsap.utils.random(0.5, 1.2),
      });
  
      // Set span rotation (adds 90 degrees to match trajectory direction)
      gsap.set(span, {
        rotation: angle + 90 + this.calculateRotationVariance(), // Rotation relative to the trajectory
        //backgroundColor: 'white',
        //boxShadow: '0 0 1px 1px rgba(255, 255, 255, 0.8)', // Glow effect
      });
  
      // Animate the star
      gsap.to(element, {
        x: `${endX}vw`,
        y: `${endY}vh`,
        opacity: 0,
        duration: randomDuration,
        ease: 'power1.out',
        delay: randomDelay,
        repeat: -1, // Infinite repeat
        repeatDelay: repeatDelay, // Délai entre les répétitions
    onRepeat: () => {
      // Réinitialisation de l'opacité après chaque cycle
      gsap.set(element, { opacity: 0 });
    },
      });
    }

    // Fonction pour redessiner les étoiles filantes avec le nouvel angle
    redrawStars(): void {
      const borderWrap = this.el.nativeElement.querySelector(".gsap-border");
      borderWrap.innerHTML = ""; // Supprime les anciennes étoiles
    
      const angle = this.calculateAngle(); // Calcul de l'angle des étoiles filantes
    
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const li = this.renderer.createElement("li");
          const span = this.renderer.createElement("span");
    
          this.renderer.appendChild(li, span);
          this.renderer.appendChild(borderWrap, li);
    
          // Créer une étoile avec un délai unique
          this.createFallingStar(li, span, angle);
        }, i * 2000); // Espacer chaque création de 2 secondes
      }
    }
    

  // Écouter le redimensionnement de la fenêtre
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.redrawStars(); // Redessiner les étoiles avec le nouvel angle
    this.adjustPlaceholderSize();
    this.isLargeScreen = this.largeScreenQuery.matches;
    this.isSmallScreen = this.mobileScreenQuery.matches;
    this.largeScreenQuery.addEventListener('change', this.onScreenResize);
    this.mobileScreenQuery.addEventListener('change', this.onScreenResize);
  }
  private onScreenResize = (event: MediaQueryListEvent) => {
    this.isLargeScreen = event.matches;
    this.isSmallScreen = event.matches;
  };
  ngOnDestroy() {
    // Nettoie l'écouteur pour éviter les fuites de mémoire
    this.largeScreenQuery.removeEventListener('change', this.onScreenResize);
    this.mobileScreenQuery.removeEventListener('change', this.onScreenResize);
  }
  ngAfterViewInit(): void {
    gsap.registerPlugin(Flip, ScrollTrigger, Observer, ScrollToPlugin, Draggable, MotionPathPlugin, EaselPlugin, PixiPlugin, TextPlugin, RoughEase, ExpoScaleEase, SlowMo, CustomEase);
    console.clear();
    this.redrawStars();
    this.isLargeScreen = this.largeScreenQuery.matches;
    this.isSmallScreen = this.mobileScreenQuery.matches;
    this.largeScreenQuery.addEventListener('change', this.onScreenResize);
    this.mobileScreenQuery.addEventListener('change', this.onScreenResize);
    const borderWrap = this.el.nativeElement.querySelector('.gsap-border');
    const angle = this.calculateAngle(); // Recalculer l'angle selon la taille de l'écran

        // Create stars and append them to the borderWrap
        /*for (let i = 0; i < 2; i++) { // Créer 5 étoiles filantes
          const li = this.renderer.createElement('li');
          const span = this.renderer.createElement('span');
    
          this.renderer.appendChild(li, span);
          this.renderer.appendChild(borderWrap, li);
    
          this.createFallingStar(li, span, angle); 
    
          //const hue = gsap.utils.random(0, 360);
          //this.renderer.setStyle(span, 'background-color', `hsl(${hue}, 70%, 90%)`);
        }*/
    

       // FIN ETOILES FILANTES
    // Écouter les changements de taille de la fenêtre
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        // Faire défiler vers le haut de la page
        //window.scrollTo(0, 0);

        // Exécuter la logique pour remettre le placeholder à 0 et retirer la classe minimized
        const svgContainer = this.el.nativeElement.querySelector('.svg-container');
        const placeholder = this.el.nativeElement.querySelector('.title-placeholder');
        if (svgContainer && placeholder) {
          placeholder.style.height = '0px'; // Réduire la taille du placeholder
          this.renderer.removeClass(svgContainer, 'minimized'); // Retirer la classe minimized
        }

        console.log("Window resized, page scrolled to top and SVG restored.");
      }, 200); // 200 ms après la fin du redimensionnement
    });
    
  }
}

