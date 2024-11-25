import { 
  Component, 
  ElementRef, 
  ViewChildren, 
  AfterViewInit, 
  Renderer2, 
  QueryList, 
  OnDestroy 
} from '@angular/core';
import * as focusTrap from 'focus-trap';
import gsap from 'gsap';
import $ from "jquery";

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit, OnDestroy {
  private autoRun: number | null = null;
  private trap: any;
  private activeModal: HTMLElement | null = null;
  private closing: boolean = false;

  @ViewChildren('descriptionSection') descriptionSections!: QueryList<ElementRef>;

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

  private openModal(modal: HTMLElement): void {
    if (modal.classList.contains('--active')) {
      return;
    }

    modal.classList.add('--active');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    this.trap = focusTrap.createFocusTrap(modal);
    this.trap.activate({ initialFocus: false });
    this.activeModal = modal;

    const description = this.descriptionSections.find((section) =>
      modal.contains(section.nativeElement)
    );

    if (description) {
      this.animateDescriptionSection(description);
    }

    this.initializeSlider(modal);

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
  }
  private enableImageLinks(modal: HTMLElement): void {
    const slider = $(modal).find('.slider');
    if (!slider.length) return;
  
    // Ajouter un gestionnaire de clic pour chaque image
    slider.find('ul li').on('click', function () {
      const url = $(this).data('url');
      if (url) {
        window.open(url, '_blank'); // Ouvre le lien dans un nouvel onglet
      }
    });
  }
  private initializeSlider(modal: HTMLElement): void {
    const slider = $(modal).find('.slider');
    const slides = slider.find('ul li');
    const activePoints = slider.find('ol li');
    const controll = slider.find('.controll');
    const playpause = slider.find('.playpause');
    const sliderWait = 3000; // Temps d'auto-défilement
    const sliderTime = 1; // Durée de l'animation
    let isAnimating = false; // Évite les animations multiples
    let stop = false; // État Play/Pause
    let autoRun: number | null = null;
  
    // Initialisation : première slide active
    slides.first().css("left", 0).addClass("active");
    activePoints.first().addClass("active");
  
    // Fonction pour activer une slide
    const runSlider = (targetIndex: number, direction: string) => {
      if (isAnimating) return; // Si une animation est en cours, on ne fait rien
      isAnimating = true;
    
      const currentIndex = slides.index(slides.filter(".active"));
    
      // Pas d'animation si on reste sur la même slide
      if (targetIndex === currentIndex) {
        isAnimating = false;
        return;
      }
    
      // Détermine la direction de l'animation
      const enterFrom = direction === "next" ? "100%" : "-100%";
      const exitTo = direction === "next" ? "-100%" : "100%";
    
      // Synchronisation des animations entrantes et sortantes avec chevauchement
      gsap.timeline()
        .set(slides.eq(targetIndex), { left: enterFrom, zIndex: 1 }) // Prépare la slide cible
        .to(slides.eq(currentIndex), {
          left: exitTo,
          duration: sliderTime,
          ease: "power2.inOut", // Transition fluide
          onComplete: () => {
            slides.eq(currentIndex).removeClass("active"); // Retire la classe `active` de l'image sortante
          },
        }, 0) // Animation sortante commence immédiatement
        .to(slides.eq(targetIndex), {
          left: "0%",
          duration: sliderTime,
          ease: "power2.inOut", // Transition fluide
          onStart: () => {
            slides.eq(targetIndex).addClass("active"); // Ajoute la classe `active` à l'image entrante
            activePoints.removeClass("active").eq(targetIndex).addClass("active"); // Met à jour la pagination
          },
          onComplete: () => {
            isAnimating = false; // Libère le verrou d'animation
          },
        }, 0); // Animation entrante commence en même temps que la sortie
    };
  
    // Fonction pour aller à la slide suivante
    const nextSlide = () => {
      const currentIndex = slides.index(slides.filter(".active"));
      const nextIndex = (currentIndex + 1) % slides.length; // Reboucle vers la première slide
      runSlider(nextIndex, "next");
    };
  
    // Fonction pour aller à la slide précédente
    const prevSlide = () => {
      const currentIndex = slides.index(slides.filter(".active"));
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length; // Reboucle vers la dernière slide
      runSlider(prevIndex, "prev");
    };
  
    // Gestion des boutons de contrôle
    controll.first().on('click', prevSlide); // Bouton "Previous"
    controll.last().on('click', nextSlide); // Bouton "Next"
  
    // Auto-défilement
    const startAutoSlide = () => {
      if (!stop && !autoRun) {
        autoRun = window.setInterval(nextSlide, sliderWait);
      }
    };
  
    const stopAutoSlide = () => {
      if (autoRun) {
        clearInterval(autoRun);
        autoRun = null;
      }
    };
  
    // Gestion du bouton Play/Pause
    playpause.on('click', () => {
      stop = !stop;
      playpause.toggleClass("fa-play-circle fa-pause-circle");
      if (stop) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });
  
    // Navigation via pagination (points)
    activePoints.on('click', function () {
      const index = $(this).index();
      const currentIndex = slides.index(slides.filter(".active"));
      if (index !== currentIndex) {
        const direction = index > currentIndex ? "next" : "prev";
        runSlider(index, direction);
      }
    });
  
    // Arrêt automatique au survol des contrôles ou pagination
    controll.on('mouseenter', stopAutoSlide);
    activePoints.on('mouseenter', stopAutoSlide);
  
    // Reprise automatique au retrait du survol
    controll.on('mouseleave', startAutoSlide);
    activePoints.on('mouseleave', startAutoSlide);
  

      // Activer les liens d'image
  this.enableImageLinks(modal);
    // Démarrage automatique
    startAutoSlide();
  }
  
  
  
  

  private animateDescriptionSection(description: ElementRef): void {
    const tl2: gsap.core.Timeline = gsap.timeline({
      duration: 0.5,
      ease: "slow(0.7, 0.7, false)"
    });

    const allLinks: HTMLElement[] = gsap.utils.toArray("p a") as HTMLElement[];

    gsap.set(allLinks, { y: -100, autoAlpha: 0, scale: 1.5, rotationX: 45 });

    tl2
      .to(description.nativeElement, { opacity: 0.9, duration: 1 })
      .to(allLinks, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.4, rotationX: 0, duration: 0.2 });
  }

  private closeModal(modal: HTMLElement): void {
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
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        this.trap.deactivate();
        this.closing = false;
        modal.classList.remove('--active');

        // Cleanup slider auto-run
        if (this.autoRun) {
          clearInterval(this.autoRun);
          this.autoRun = null;
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.autoRun) {
      clearInterval(this.autoRun);
    }
    gsap.globalTimeline.clear();
  }
}
