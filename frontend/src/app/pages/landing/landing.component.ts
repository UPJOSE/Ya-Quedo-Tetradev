import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FAQ {
  question: string;
  answer: string;
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
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
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

  statistics = [
    { value: '3000+', label: 'Servicios completados' },
    { value: '500+', label: 'Profesionales' },
    { value: '95%', label: 'Usuarios satisfechos' },
    { value: '4.9★', label: 'Calificación promedio' },
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

  toggleFaq(index: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
  }

  starRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}
