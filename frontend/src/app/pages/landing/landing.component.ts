import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../components/reveal.directive';

interface FAQ {
  question: string;
  answer: string;
}

interface CategoryCard {
  name: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  occupation: string;
  location: string;
  rating: number;
  image: string;
  quote: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  heroStats = [
    { value: '500+', label: 'Técnicos verificados' },
    { value: '95%', label: 'Satisfacción del cliente' },
    { value: '8 min', label: 'Tiempo de respuesta promedio' },
    { value: '4.9★', label: 'Calificación promedio' },
  ];

  customerBenefits = [
    { title: 'Profesionales verificados', description: 'Todos los técnicos tienen verificación de antecedentes y habilidades certificadas.' },
    { title: 'Respuesta rápida', description: 'Tiempo de respuesta promedio de solo 8 minutos.' },
    { title: 'Precios justos', description: 'Precios transparentes sin costos ocultos.' },
    { title: 'Garantía de calidad', description: 'Satisfacción garantizada o te devolvemos tu dinero.' },
  ];

  technicianBenefits = [
    { title: 'Más clientes', description: 'Acceso a miles de clientes potenciales.' },
    { title: 'Reputación digital', description: 'Construye tu perfil profesional y tus reseñas.' },
    { title: 'Pagos seguros', description: 'Ingresos confiables con transacciones protegidas.' },
    { title: 'Horario flexible', description: 'Trabaja cuando quieras, en los trabajos que elijas.' },
  ];

  howItWorks = [
    { step: 1, title: 'Describe tu problema', description: 'Cuéntanos qué necesitas y cuál es tu ubicación.' },
    { step: 2, title: 'Recibe recomendaciones con IA', description: 'Nuestro algoritmo te conecta con los mejores técnicos disponibles.' },
    { step: 3, title: 'Compara técnicos', description: 'Revisa perfiles, calificaciones y precios para elegir el mejor.' },
    { step: 4, title: 'Contrata con confianza', description: 'Reserva tu servicio con calidad garantizada y pago seguro.' },
  ];

  statistics: { target: number; suffix: string; decimals?: number; label: string; icon: string }[] = [
    { target: 3000, suffix: '+', label: 'Servicios completados', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { target: 500, suffix: '+', label: 'Profesionales', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { target: 95, suffix: '%', label: 'Usuarios satisfechos', icon: 'M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.25 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z' },
    { target: 4.9, suffix: '★', decimals: 1, label: 'Calificación promedio', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  ];

  animatedStats = signal<string[]>(this.statistics.map(() => '0'));

  categories: CategoryCard[] = [
    { name: 'Electricidad', description: 'Instalaciones, cortocircuitos y tableros eléctricos.', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
    { name: 'Plomería', description: 'Fugas, cañerías, grifería e instalaciones sanitarias.', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085' },
    { name: 'Cerrajería', description: 'Aperturas, cambios de cerradura y duplicado de llaves.', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z' },
    { name: 'Computadoras', description: 'Reparación, formateo y mantenimiento de equipos.', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25' },
    { name: 'Electrodomésticos', description: 'Refrigeradoras, lavadoras, cocinas y más.', icon: 'M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z' },
    { name: 'Pintura', description: 'Interiores, exteriores y acabados profesionales.', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { name: 'Carpintería', description: 'Muebles a medida, reparaciones y acabados en madera.', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085', },
    { name: 'Mantenimiento', description: 'Reparaciones generales y cuidado integral del hogar.', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'María González',
      occupation: 'Propietaria de casa',
      location: 'Lima, Perú',
      rating: 5,
      image: 'MG',
      quote: 'YA QUEDÓ transformó la forma en que encuentro servicios para el hogar. El electricista llegó en 10 minutos y hizo un trabajo excelente. ¡Finalmente un servicio en el que puedo confiar!',
    },
    {
      name: 'Carlos Rodríguez',
      occupation: 'Dueño de pequeña empresa',
      location: 'Arequipa, Perú',
      rating: 5,
      image: 'CR',
      quote: 'Como técnico, esta plataforma ha duplicado mi cartera de clientes. Los pagos seguros y el sistema de reseñas hacen todo más profesional y confiable.',
    },
    {
      name: 'Ana Martínez',
      occupation: 'Profesional',
      location: 'Cusco, Perú',
      rating: 5,
      image: 'AM',
      quote: 'Antes me angustiaba buscar plomeros. Ahora solo describo mi problema y me conectan con profesionales verificados. Las recomendaciones con IA son exactas.',
    },
  ];

  faqs: FAQ[] = [
    {
      question: '¿Cómo se verifican los técnicos?',
      answer: 'Cada técnico pasa por una verificación exhaustiva de antecedentes, identidad y evaluación de habilidades. También verificamos su historial laboral y exigimos certificaciones válidas para servicios especializados.',
    },
    {
      question: '¿Qué pasa si no estoy satisfecho con el servicio?',
      answer: 'Ofrecemos garantía de satisfacción. Si el trabajo no cumple con los estándares acordados, puedes solicitar un reembolso a través de nuestro sistema de pagos seguro.',
    },
    {
      question: '¿Cómo funciona el sistema de recomendaciones con IA?',
      answer: 'Nuestra IA analiza múltiples factores como tu ubicación, tipo de servicio, urgencia, disponibilidad del técnico, calificaciones y experiencia para recomendar la mejor opción.',
    },
    {
      question: '¿Mi información de pago está segura?',
      answer: 'Por supuesto. Utilizamos encriptación y procesamiento de pagos a nivel bancario. Tu pago se mantiene en custodia hasta que el servicio se complete.',
    },
    {
      question: '¿Puedo convertirme en técnico en la plataforma?',
      answer: '¡Sí! Damos la bienvenida a técnicos calificados. Deberás completar nuestro proceso de verificación, proporcionar certificaciones válidas y aprobar nuestra evaluación de habilidades.',
    },
    {
      question: '¿Qué servicios están disponibles?',
      answer: 'Actualmente ofrecemos trabajo eléctrico, plomería, cerrajería, reparación de computadoras, reparación de electrodomésticos, pintura y mantenimiento general del hogar.',
    },
  ];

  openFaqIndex = signal<number | null>(null);

  activeTestimonial = signal(0);
  private carouselTimer?: ReturnType<typeof setInterval>;
  private statsObserver?: IntersectionObserver;
  private statsAnimated = false;

  @ViewChild('statsSection') statsSection?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.carouselTimer = setInterval(() => {
      this.activeTestimonial.set((this.activeTestimonial() + 1) % this.testimonials.length);
    }, 6000);

    const target = this.statsSection?.nativeElement;
    if (target && typeof IntersectionObserver !== 'undefined') {
      this.statsObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting) && !this.statsAnimated) {
            this.statsAnimated = true;
            this.runCountUp();
            this.statsObserver?.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      this.statsObserver.observe(target);
    } else {
      this.runCountUp();
    }
  }

  private runCountUp(): void {
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.animatedStats.set(
        this.statistics.map((s) => {
          const value = s.target * eased;
          return s.decimals ? value.toFixed(s.decimals) : Math.round(value).toLocaleString();
        })
      );
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  setTestimonial(index: number): void {
    this.activeTestimonial.set(index);
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = setInterval(() => {
        this.activeTestimonial.set((this.activeTestimonial() + 1) % this.testimonials.length);
      }, 6000);
    }
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
    this.statsObserver?.disconnect();
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
  }

  starRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}
