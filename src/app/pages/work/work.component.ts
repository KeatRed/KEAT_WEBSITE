import { Component, ElementRef,ViewChild, AfterViewInit, Renderer2, HostListener  } from '@angular/core';
import * as focusTrap from 'focus-trap';
import gsap from 'gsap';
import $ from "jquery";
@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit {

  private trap: any;
  private activeModal: HTMLElement | null = null;
  private closing: boolean = false;

  @ViewChild('descriptionSection') descriptionSection!: ElementRef;
  
  private maxPadding = 20; // Limite maximale pour le padding-top en pixels
  private resizeTimeout: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    const modalContainers = this.el.nativeElement.querySelectorAll('.modal__container');


    modalContainers.forEach((modalContainer: HTMLElement) => {
      this.renderer.listen(modalContainer, 'click', (e: Event) => {
        e.stopPropagation();
      });
    });

    const openBtns = this.el.nativeElement.querySelectorAll('[data-modal-open]');
    openBtns.forEach((openBtn: HTMLElement) => {
      const target = document.getElementById(openBtn.dataset['modalOpen'] as string);
      if (target !== null) {
        this.renderer.listen(openBtn, 'click', () => {
          this.openModal(target);
        });
      }
    });

    const closeBtns = this.el.nativeElement.querySelectorAll('[data-modal-close]');
    closeBtns.forEach((closeBtn: HTMLElement) => {
      this.renderer.listen(closeBtn, 'click', () => {
        if (this.activeModal !== null && !this.closing) {
          this.closeModal(this.activeModal);
        }
      });
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.activeModal !== null && !this.closing) {
        this.closeModal(this.activeModal);
      }
    });
  }

  private openModal(modal: HTMLElement) {

    "use strict";
    const slides = $(".slider ul li"); // Sélectionner toutes les slides
    const activePoints = $(".slider ol li"); // Points dans la pagination
    const body = $(".slider_body");
    const active = $(".slider ol li, .slider .controll");
    const controll = $(".slider .controll");
    const playpause = $(".playpause");

    const sliderTime = 1;
    const sliderWait = 3000;
    let i = 999;
    let autoRun: number;
    let stop = false;

  // Initialisation: première slide active
  $(".slider ul li:first").css("left", 0);
  activePoints.eq(0).addClass("active"); // Le premier point devient actif

// Fonction pour gérer l'activation du slider
  // Simplification de la fonction runSlider pour prendre uniquement l'index
  const runSlider = (index: number) => {
    slides.removeClass("active").eq(index).addClass("active"); // Active la slide correspondante
    activePoints.removeClass("active").eq(index).addClass("active"); // Active la pastille correspondante
  };

// Fonction pour gérer l'animation GSAP
const gsapSlider = (index: number, left: string) => {
  i++;
  gsap.fromTo(
    slides.eq(index),
    { zIndex: i, left: left },
    { left: 0, duration: sliderTime }
  );
};






  // Activation des contrôles gauche/droite
  controll.first().on("click", () => {
    const activeIndex = slides.index(slides.filter(".active"));
    const prevIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;
    runSlider(prevIndex);
    gsapSlider(prevIndex, "100%");
  });

  controll.last().on("click", () => {
    const activeIndex = slides.index(slides.filter(".active"));
    const nextIndex = (activeIndex + 1) % slides.length;
    runSlider(nextIndex);
    gsapSlider(nextIndex, "-100%");
  });
  // Clic sur les pastilles pour naviguer vers la slide correspondante
  activePoints.on("click", function () {
    const index = $(this).index(); // Récupère l'index de la pastille cliquée
    const currentIndex = slides.index(slides.filter(".active"));
    runSlider(index); // Active la slide et la pastille correspondantes
    if (currentIndex > index) {
      gsapSlider(index, "100%"); // Si on va vers une slide précédente
    } else if (currentIndex < index) {
      gsapSlider(index, "-100%"); // Si on va vers une slide suivante
    }
  });
  // Fonction d'auto-défilement
  function autoRunSlider() {
    if (body.css("direction") === "ltr" && stop === false) {
        autoRun = window.setInterval(() => {
            controll.last().trigger("click");
        }, sliderWait);
    } else if (body.css("direction") === "rtl" && stop === false) {
        autoRun = window.setInterval(() => {
            controll.first().trigger("click");
        }, sliderWait);
    }
}



  // Clic sur une slide pour ouvrir l'image en grand dans un nouvel onglet
  slides.on("click", function () {
    const url = $(this).data("url");
    if (url) {
      window.open(url, '_blank'); // Ouvre le lien dans un nouvel onglet
    }
  });

autoRunSlider();

  // Arrêt du défilement automatique au survol
  activePoints.on("mouseenter", () => {
    if (!stop) clearInterval(autoRun);
  });

  // Reprise du défilement automatique lorsque le curseur quitte les contrôles
  activePoints.on("mouseleave", () => {
    if (!stop) autoRunSlider();
  });

// Lecture/pause
  // Fonction pour gérer l'état play/pause avec le bouton
  playpause.on("click", function () {
    $(this).toggleClass("fa-play-circle fa-pause-circle"); // Alterne les icônes
    stop = !stop; // Change l'état play/pause

    if (stop) {
      clearInterval(autoRun); // Arrête l'auto-défilement si en pause
      $(this).attr("title", "play");
    } else {
      autoRunSlider(); // Redémarre l'auto-défilement si en lecture
      $(this).attr("title", "pause");
    }
  });

    if (modal.classList.contains('--active')) {
      return;
    }
    modal.classList.add('--active');
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // Calculate scrollbar width
    document.body.style.paddingRight = `${scrollbarWidth}px`;  // Adjust body padding to prevent layout shift
    document.body.style.overflow = 'hidden';  // Disable background scroll
  
    this.trap = focusTrap.createFocusTrap(modal);
    this.trap.activate({ initialFocus: false });
    this.activeModal = modal;
  
    const tl = gsap.timeline();
    const container = modal.querySelector('.modal__container') as HTMLElement;
    container.setAttribute('aria-modal', 'true');
    container.removeAttribute('aria-hidden');
  
    tl.to(container, {
      opacity: 1,
      duration: 0
    });
    tl.to(modal, {
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
    });
    tl.fromTo(container, {
      scale: 0
    }, {
      duration: 0.3,
      scale: 1,
      ease: "elastic.out(1, 0.9)",
    }, "<.1");

    // Initialize the GSAP timeline with type annotations
    const tl2: gsap.core.Timeline = gsap.timeline({
      duration: 0.5,
      ease: "slow(0.7, 0.7, false)" // SlowMo easing
    });
// Select all links within paragraph tags and set their type
const allLinks: HTMLElement[] = gsap.utils.toArray("p a") as HTMLElement[];

// Query elements by class and define their type as HTMLElement or null
const lineOne = document.querySelector(".one") as HTMLElement | null;
const lineTwo = document.querySelector(".two") as HTMLElement | null;
const lineThree = document.querySelector(".three") as HTMLElement | null;

if (lineOne && lineThree) {
  gsap.set([lineOne, lineThree], { xPercent: 100, autoAlpha: 0 });
}
if (lineTwo) {
  gsap.set(lineTwo, { xPercent: -100, autoAlpha: 0 });
}
gsap.set(allLinks, { y: -100, autoAlpha: 0, scale: 1.5, rotationX: 45 });

// Define the animation sequence
tl2
  .to(lineOne, { xPercent: 0, autoAlpha: 1, duration: 1  })
  .to(lineTwo, { xPercent: 0, autoAlpha: 1, duration: 1  }, "-=.15")
  .to(lineThree, { xPercent: 0, autoAlpha: 1, duration: 1  }, "-=.21")
  .to(allLinks, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.4, rotationX: 0, duration: 0.2  });
  }
  


  private closeModal(modal: HTMLElement) {
    this.closing = true;
    const tl = gsap.timeline();
    const container = modal.querySelector('.modal__container') as HTMLElement;
    container.removeAttribute('aria-modal');
    container.setAttribute('aria-hidden', 'true');
  
    tl.to(container, {
      opacity: 0,
      y: -0,
      duration: 0.3,
    });
    tl.to(container, {
      y: 0,
      duration: 0,
    });
    tl.to(modal, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        document.body.style.overflow = '';  // Re-enable background scroll
        document.body.style.paddingRight = '';  // Reset padding
        this.trap.deactivate();
        this.closing = false;
        modal.classList.remove('--active');
      },
    });
  }
  



}
