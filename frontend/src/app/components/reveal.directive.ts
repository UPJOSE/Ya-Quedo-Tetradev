import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

/**
 * Directiva puramente visual: revela el elemento con un fade-up suave
 * cuando entra en el viewport. No afecta ninguna lógica de negocio.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.style.opacity = '0';
    node.style.transform = 'translateY(28px)';
    node.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${this.revealDelay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${this.revealDelay}ms`;
    node.style.willChange = 'opacity, transform';

    if (typeof IntersectionObserver === 'undefined') {
      this.show();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.show();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.12 }
    );
    this.observer.observe(node);
  }

  private show(): void {
    const node = this.el.nativeElement;
    node.style.opacity = '1';
    node.style.transform = 'translateY(0)';
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
